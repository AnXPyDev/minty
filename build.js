{
    const fs = require("fs");
    const fse = require("fs-extra");
    var dir = '../built';


    let fl = fs.readdirSync(dir), 

    files = fl.map(function (fileName) {
        return {
        name: fileName,
        time: fs.statSync(dir + '/' + fileName).mtime.getTime()
        };
    })
    .sort(function (a, b) {
        return b.time - a.time; })
    .map(function (v) {
        return v.name; });
    
    fse.copySync(`../${process.argv[2]}`, `${dir}/${files[0]}/resources/${process.argv[2]}`);
    console.log("Copied game");
}
