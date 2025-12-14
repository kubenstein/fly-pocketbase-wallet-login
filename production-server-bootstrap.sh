#!/bin/sh

pm2 delete all

#
#### Start the app
pm2 start -i 1 \
  --name webapp \
  --execute-command 'cd ./webapp ; HOST=0.0.0.0 PORT=8000 node index.js'


#
#### Startpocketbase
/usr/app/pocketbase superuser upsert $POCKETBASE_SUPERADMIN_USER $POCKETBASE_SUPERADMIN_PASS \
  --dir="/mnt/persistent_volume/pb/pb_data"

pm2 start -i 1 \
  --no-daemon \
  --name pocketbase \
  --execute-command '
    /usr/app/pocketbase serve \
      --http=0.0.0.0:8002 \
      --dir="/mnt/persistent_volume/pb/pb_data" \
      --migrationsDir="/mnt/persistent_volume/pb/pb_migrations" \
      --hooksDir="/mnt/persistent_volume/pb/pb_hooks"
  '
