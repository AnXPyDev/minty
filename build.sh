#!/bin/bash

if [[ "$3" == "dev" ]];  then
    sh compile.sh $1;
else
    sh compile.sh $1 nodev;
fi

echo "Building app ...";
./node_modules/.bin/electron-packager ./ $1 --out=../built --overwrite --platform=$2;
cd scripts;
node build.js $1;
