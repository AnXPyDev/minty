echo "Compiling for $1 ...";
./node_modules/.bin/tsc; echo "Built Minty";
node compile.js $1 $2;
