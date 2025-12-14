#!/bin/bash

# stop on error
set -e

function main () {
  deploy_the_app
}

########

function deploy_the_app () {
  DOCKER_BUILDKIT=false \
  fly deploy \
    --no-cache \
    --access-token "$FLY_ACCESS_TOKEN" \
    --config fly.production.toml \
    --ha=false
}

# go!
main
