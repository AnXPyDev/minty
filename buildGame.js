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
            })
            console.log("Sucessfully built game.cfg.json");
        })
    });
}
