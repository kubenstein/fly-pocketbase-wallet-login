# pocketbase-wallet-login
A demo application implementing Sign-In with Ethereum (SIWE) using a PocketBase backend.

## Development

1. Start the web app

copy `.env.example` -> `.env`

```bash
npm run dev

# then visit:
# http://localhost:5173/
```

2. Start pocketbase DB

```bash
docker run -it --rm -p 8090:8090 \
	-v "$(pwd)/pb/pb_data:/pb_data" \
	-v "$(pwd)/pb/pb_hooks:/pb_hooks" \
	-v "$(pwd)/pb/pb_migrations:/pb_migrations" \
	-e PB_ADMIN_EMAIL="info@mini-labo.org" \
	-e PB_ADMIN_PASSWORD="info@mini-labo.org" \
	nxtgencat/pocketbase --http 0.0.0.0:8090
```

## Deployments

Deployments to fly.io are done automatically via GHA, on push to `master` branch.
