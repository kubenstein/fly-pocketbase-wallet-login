#!/bin/sh

pm2 delete all

#
#### Start the app
pm2 start -i 1 \
  --name webapp \
  --execute-command 'cd ./webapp ; HOST=0.0.0.0 PORT=8000 node index.js'


#
#### Start pocketbase
echo "Setting up PocketBase superusers..."
./pb/pocketbase superuser upsert $POCKETBASE_SUPERADMIN_USER $POCKETBASE_SUPERADMIN_PASS --dir="/mnt/persistent_volume/pb/pb_data"
./pb/pocketbase superuser upsert $POCKETBASE_AUTH_USER $POCKETBASE_AUTH_PASS --dir="/mnt/persistent_volume/pb/pb_data"

echo "Syncing migration files..."
mkdir -p /mnt/persistent_volume/pb/pb_migrations/
cp -rf ./pb/pb_migrations/* /mnt/persistent_volume/pb/pb_migrations/

pm2 start -i 1 \
  --no-daemon \
  --name pocketbase \
  --execute-command '
    ./pb/pocketbase serve \
      --http=0.0.0.0:8002 \
      --dir="/mnt/persistent_volume/pb/pb_data" \
      --migrationsDir="/mnt/persistent_volume/pb/pb_migrations" \
      --hooksDir="./pb/pb_hooks"
  '
