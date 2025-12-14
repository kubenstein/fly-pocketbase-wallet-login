#!/bin/bash

# stop on error
set -e

COMMAND=$@


DOCKERFILE=$(cat <<FILE
  FROM node:20-slim
  WORKDIR /usr/app/
  RUN apt-get update \
    && apt-get install -y curl git zip bash \
    && apt-get clean \
    && git config --global --add safe.directory /usr/app

  # Install fly
  RUN curl -L https://fly.io/install.sh | sh \
    && echo 'export FLYCTL_INSTALL="/root/.fly"' >> ~/.profile \
    && echo 'export PATH="$''FLYCTL_INSTALL/bin:$''PATH"' >> ~/.profile
FILE
)
echo "$DOCKERFILE" | DOCKER_CLI_HINTS=false docker build -t dev-env -

docker run -i --rm \
  $([ -z "$NO_TTY" ] && echo '-t') \
  -e CI \
  -e FLY_ACCESS_TOKEN \
  -p 5173:5173 \
  -v "$PWD":/usr/app \
  -v dev-env-node-modules:/usr/app/node_modules \
  dev-env \
  sh -l -c "${COMMAND:-bash}"
