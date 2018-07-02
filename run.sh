echo "Launching the app ...";

if [ "$(expr substr $(uname -s) 1 5)" = "Linux" ]; then
    ./node_modules/.bin/electron . $1;
elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW32_NT" ]; then
    ./node_modules/electron/dist/gelectron.exe . $1;
elif [ "$(expr substr $(uname -s) 1 10)" = "MINGW64_NT" ]; then
    ./node_modules/electron/dist/gelectron.exe . $1;

fi