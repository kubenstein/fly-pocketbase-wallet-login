#
# Throw-away webapp build stage
FROM node:20-alpine AS webapp-builder
WORKDIR /usr/app
COPY . ./

RUN cat fly.production.toml | grep PUBLIC_POCKETBASE_URL >> .env
ENV POCKETBASE_AUTH_USER dummy
ENV POCKETBASE_AUTH_PASS dummy

RUN npm i \
 && npm run check \
 && npm run build \
 && cp package.json package-lock.json ./build/ \
 && (cd ./build/ ; npm ci --only=production)

#
# Throw-away pocketbase build stage
FROM node:20-alpine AS pocketbase-builder
WORKDIR /usr/app

RUN apk add --no-cache unzip

ADD https://github.com/pocketbase/pocketbase/releases/download/v0.31.0/pocketbase_0.31.0_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d ./build/

COPY . ./

RUN mkdir -p pb/pb_hooks pb/pb_migrations \
 && cp -R pb/pb_hooks ./build/pb_hooks \
 && cp -R pb/pb_migrations ./build/pb_migrations

#
# Actual production image
FROM node:20-alpine
WORKDIR /usr/app
ENV NODE_ENV="production"

RUN npm install -g pm2

COPY production-server-bootstrap.sh production-server-bootstrap.sh
COPY --from=webapp-builder /usr/app/build/ ./webapp/
COPY --from=pocketbase-builder /usr/app/build/ ./pb/
CMD ["./production-server-bootstrap.sh"]
