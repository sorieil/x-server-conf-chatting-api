#!/bin/bash
set -e
sudo apt install node-typescript
DIR="server-conference-chatting-api-new"
if [ -d "$DIR" ]; then
    rm -rf $DIR
    echo "Delete " + $DIR
fi
git clone https://xsyncdev@bitbucket.org/xsync_development/server-conference-chatting-api.git $DIR
echo "Clone success"
cd $DIR
git checkout -t origin/test
echo "Success git pull"
yarn
echo "Success install node_moduels"
# tsc
echo "Success Build"
cd ~
rm -rf server-conference-chatting-api
mv $DIR server-conference-chatting-api
cd server-conference-chatting-api
pm2 start ecosystem.config.js --env=development
echo "Success Start"
echo "Successfully deploy"