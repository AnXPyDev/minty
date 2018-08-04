./node_modules/.bin/tsc; echo "Built Minty";
cd scripts;
node compile.js $1 $2;