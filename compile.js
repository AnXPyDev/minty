const fs = require("fs");
const rls = require("readline-sync").question;

function main() {
    const paths = function() {
        const json = require("./base/refference_paths.json");
        if (process.argv[2] != null) {
            json.project = "../" + process.argv[2];
            json.project_name = process.argv[2];
        }

        fs.writeFileSync("./paths.json", JSON.stringify(json));
        return json;
    }();


    {
        const json = require("./base/refference.json");
        fs.readdir("./compiled/modules", function(err, files) {
            files.forEach(file => {
                json.modules.push(file.split(".")[0]);
            });
            fs.readdir("./src/packages", function(err, files) {
                files.forEach(file => {
                    json.packages.push(file.split(".")[0]);
                });
                if(process.argv[3] == "nodev") {
                    json.developer = false;
                    console.log("Developer mode disabled!");
                }
                fs.writeFile("./minty.cfg.json", JSON.stringify(json), function() {
                    console.log("Sucessfully built minty.cfg.json");
                });
            });      
        });
        
    }

    {
        const json = require("./base/refference_game.json"); 
        const types = { 
            image: ["jpg", "svg", "png"], 
            sound: ["mp3", "wav"] 
        } 
        if (!fs.existsSync(paths.project)){ 
            fs.mkdirSync(paths.project); 
        } 
        if (!fs.existsSync(paths.project + "/code")){ 
            fs.mkdirSync(paths.project + "/code"); 
        } 
        if (!fs.existsSync(paths.project + "/assets")){ 
            fs.mkdirSync(paths.project + "/assets"); 
        } 
        if (!fs.existsSync(paths.project + "/assets/img")){ 
            fs.mkdirSync(paths.project + "/assets/img"); 
        } 
        if (!fs.existsSync(paths.project + "/assets/snd")){ 
            fs.mkdirSync(paths.project + "/assets/snd"); 
        } 
    
        let ec = 0; 
        fs.readdir(paths.project + "/code", function (err, files) { 
            files.forEach(file => { 
                let extension = file.split(".")[1]; 
                if (extension == "js") { 
                    json.code.js.push(file); 
                } else if (extension == "json") { 
                    json.code.json.push(file); 
                } 
            }); 
            fs.readdir(paths.project + "/assets/img", function (err, files) { 
                files.forEach(file => { 
                    let extension = file.split(".")[1]; 
                    if (types.image.includes(extension)) { 
                        json.assets.images.push(file); 
                    } 
                }) 
                fs.readdir(paths.project + "/assets/snd", function (err, files) { 
                    files.forEach(file => { 
                        let extension = file.split(".")[1]; 
                        if (types.sound.includes(extension)) { 
                            json.assets.sounds.push(file); 
                        } 
                    });
                    fs.writeFile(paths.project + "/game.cfg.json", JSON.stringify(json), () => {console.log("Sucessfully built game.cfg.json"); }); 
                }) 
                
            }) 
        }); 
    } 

    {
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
}

if(fs.existsSync("../" + process.argv[2])) {
    console.log("Project already exists");
    main();
} else {
    let r = rls("Target project does not exist, do you want to create it ? (yes/no) ");
    if(["y", "yes", "ok", "yeekes", "yuh"].includes(r.toLowerCase())) {
        main();
    }
}