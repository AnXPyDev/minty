{
    const fs = require("fs");
    const json = require("./base/refference_game.json");
    const types = {
        image: ["jpg", "svg", "png"],
        sound: ["mp3"]
    }
    let ec = 0;
    fs.readdir("./project/code", function (err, files) {
        if (err) {
            console.log("The folder 'project/code' is missing");
            ec++;
        } else {
            files.forEach(file => {
                let extension = file.split(".")[1];
                if (extension == "js") {
                    json.code.js.push(file);
                } else if (extension == "json") {
                    json.code.json.push(file);
                }
            });
        }
        fs.readdir("./project/assets/img", function (err, files) {
            if (err) {
                console.log("The folder 'project/assets/img' is missing");
                ec++;
            } else {
                files.forEach(file => {
                    let extension = file.split(".")[1];
                    if (types.image.includes(extension)) {
                        json.assets.images.push(file);
                    }
                })
            }
            fs.readdir("./project/assets/snd", function (err, files) {
                if (err) {
                    console.log("The folder 'project/assets/snd' is missing")
                } else {
                    files.forEach(file => {
                        let extension = file.split(".")[1];
                        if (types.sound.includes(extension)) {
                            json.assets.sounds.push(file);
                        }
                    });
                }
                if (!ec) {
                    fs.writeFile("./project/game.cfg.json", JSON.stringify(json), function() {
                        console.log("Sucessfully built game.cfg.json");
                    });
                } else {
                    console.log("Multiple errors have occured, please make sure there is 'project' folder with this structure in this folder !");
                    console.log("project/code - folder");
                    console.log("project/assets - folder");
                    console.log("project/assets/img - subfolder");
                    console.log("project/assets/snd - subfolder");
                }
            })
        })
    });
}
