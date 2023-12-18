#!/bin/bash
cd /home/shintani/workspace/mrc-test/volumes/mrc
container="svc-staging"
echo "Running php on docker container name "$container""
docker-compose exec $container php "$@"