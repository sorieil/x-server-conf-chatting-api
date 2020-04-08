#!/bin/bash
set -e
git clone https://xsync_development@bitbucket.org/xsync_development/server-conference-chatting-api.git
echo "Clone success"
cd ~/server-conference-chatting-api-new
git checkout -t origin/test
echo "Success git pull"
npm i
echo "Success node_moduels"
tsc
echo "Success Build"
cd ~
rm -rf ~/server-conference-chatting-api
mv ~/server-conference-chatting-api-new ~/server-conference-chatting-api
cd ~/server-conference-chatting-api
pm2 start ecosystem.config.js --env=production
echo "Success Start"
echo "Successfully deploy"