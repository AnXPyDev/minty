{
    const fs = require("fs");
    const json = require("./base/refference.json");
    fs.readdir("./compiled/modules", function(err, files) {
        files.forEach(file => {
            json.modules.push(file.split(".")[0]);
        });
        fs.writeFile("./minty.cfg.json", JSON.stringify(json), function() {
            console.log("Sucessfully built minty.cfg.json");
        });
    });
}

{  
    const fs = require("fs"); 
    const json = require("./base/refference_game.json"); 
    const types = { 
        image: ["jpg", "svg", "png"], 
        sound: ["mp3"] 
    } 
    if (!fs.existsSync("./project")){ 
        fs.mkdirSync("./project"); 
    } 
    if (!fs.existsSync("./project/code")){ 
        fs.mkdirSync("./project/code"); 
    } 
    if (!fs.existsSync("./project/assets")){ 
        fs.mkdirSync("./project/assets"); 
    } 
    if (!fs.existsSync("./project/assets/img")){ 
        fs.mkdirSync("./project/assets/img"); 
    } 
    if (!fs.existsSync("./project/assets/snd")){ 
        fs.mkdirSync("./project/assets/snd"); 
    } 
 
    let ec = 0; 
    fs.readdir("./project/code", function (err, files) { 
        files.forEach(file => { 
            let extension = file.split(".")[1]; 
            if (extension == "js") { 
                json.code.js.push(file); 
            } else if (extension == "json") { 
                json.code.json.push(file); 
            } 
        }); 
        fs.readdir("./project/assets/img", function (err, files) { 
            files.forEach(file => { 
                let extension = file.split(".")[1]; 
                if (types.image.includes(extension)) { 
                    json.assets.images.push(file); 
                } 
            }) 
            fs.readdir("./project/assets/snd", function (err, files) { 
                files.forEach(file => { 
                    let extension = file.split(".")[1]; 
                    if (types.sound.includes(extension)) { 
                        json.assets.sounds.push(file); 
                    } 
                });
                fs.writeFile("./project/game.cfg.json", JSON.stringify(json), () => {console.log("Sucessfully built game.cfg.json"); }); 
            }) 
            
        }) 
    }); 
} 

{
    const fs = require("fs");
    const endFile = "./docs/user.js";
    var doc = "";
    
    if (!fs.existsSync("./docs")){
        fs.mkdirSync("./docs");
    }

    fs.readFile("./compiled/main.js", (err, data) => {
        doc += function() {
            return data.toString().replace('"use strict";', "").split("module.exports")[0].split("//minty-compile-ignore")[1];
        }();
    })

    fs.readdir("./compiled/modules", (err, files) => {
        let a = 0;
        files.forEach(file => {
            fs.readFile("./compiled/modules/" + file, (err, data) => {
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