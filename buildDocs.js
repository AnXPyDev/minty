{
    const fs = require("fs");
    const endFile = "./docs/user.js";
    var doc = "";
    

    fs.readdir("./build/modules", (err, files) => {
        let a = 0;
        files.forEach(file => {
            fs.readFile("./build/modules/" + file, (err, data) => {
                a++;
                doc += function() {
                    return data.toString().replace('"use strict";', "").split("module.exports")[0];
                }();
                if (a == files.length) {
                    write();
                }
            })
        })
    });   

    function write() {
        fs.writeFile(endFile, doc, () => {
            console.log("Created documentation");
        });
    }
}