#!/bin/bash
set -e
docker cp $(docker ps -q):/usr/src/app/node_modules .
echo 'Copy successfully'
