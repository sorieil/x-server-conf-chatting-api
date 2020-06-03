#!/bin/bash
set -e
TEMP_DIR="conference-user-api-new"
DIR="conference-user-api"
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
if [[ "$BRANCH" != "prod" ]]; then
  git checkout -t origin/prod
fi
echo "Success git pull"
yarn --production=false --silent
echo "Success node_moduels"
#npx tsc You have to complie at this point, but I'm temporarily compiling locally for server performonce issues.
echo "Success Build"
cd ~
rm -rf $DIR
mv $TEMP_DIR $DIR
cd $DIR
rm -rf ./src
yarn run start
echo "Success Start"
echo "Successfully deploy"