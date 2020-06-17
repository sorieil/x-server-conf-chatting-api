#!/bin/bash
set -e
TEMP_DIR="conference-user-chatting-api-new"
DIR="conference-user-chatting-api"
APPNAMESPACE="conference-user-chatting-api.xsync.info"
if [ -d "$TEMP_DIR" ]; then
    rm -rf $TEMP_DIR
    echo "Delete " + $TEMP_DIR
fi
eval `ssh-agent -s`
ssh-add ~/.ssh/bitbucket_rsa
git clone git@bitbucket.org:xsync_development/server-conference-chatting-api.git $TEMP_DIR
echo "Clone success"
cd $TEMP_DIR
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "test" ]]; then
  git checkout -t origin/test
fi
echo "Success git pull"
yarn --production=false --silent
echo "Success node_modules"
cd ~
rm -rf $DIR
mv $TEMP_DIR $DIR
cd $DIR
pm2 delete -s $APPNAMESPACE || : 
pm2 start ecosystem.config.dev.json
echo "Success Start"
echo "Successfully deploy"