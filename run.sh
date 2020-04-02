#!/bin/bash
set -e
cd ~/server-conference-api
git pull origin test
printf "Success git pull"
npm i
printf "Success node_moduels"
tsc
printf "Success Build"
pm2 start ecosystem.config.js --env=production
printf "Success Start"
