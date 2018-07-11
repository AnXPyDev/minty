sh compile.sh $1 nodev;
echo "Building app ...";
node_modules/.bin/electron-packager ./ $1 --out=../built --overwrite --platform=$2;
node build.js $1;
