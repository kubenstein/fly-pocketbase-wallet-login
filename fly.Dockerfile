#
# Throw-away webapp build stage
FROM node:20-alpine AS webapp-builder
WORKDIR /usr/app
COPY . ./

RUN cat fly.production.toml | grep PUBLIC_POCKETBASE_URL >> .env \
 && cat fly.production.toml | grep POCKETBASE_AUTH_USER >> .env \
 && cat fly.production.toml | grep POCKETBASE_AUTH_PASS >> .env

RUN npm i \
 && npm run check \
 && npm run build \
 && cp package.json package-lock.json ./build/ \
 && (cd ./build/ ; npm ci --only=production)


#
# Actual production image
FROM node:20-alpine
WORKDIR /usr/app
ENV NODE_ENV="production"

RUN npm install -g pm2

ADD https://github.com/pocketbase/pocketbase/releases/download/v0.31.0/pocketbase_0.31.0_linux_amd64.zip /tmp/pb.zip
RUN apk add --no-cache unzip \
  && unzip /tmp/pb.zip -d /usr/app/ \
  && rm /tmp/pb.zip

COPY production-server-bootstrap.sh production-server-bootstrap.sh
COPY --from=webapp-builder /usr/app/build/ ./webapp/
CMD ["./production-server-bootstrap.sh"]
