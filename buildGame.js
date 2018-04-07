{
    const fs = require("fs");
    const json = require("./base/refference_game.json");
    const types = {
        image: ["jpg", "svg", "png"],
        sound: ["mp3"]
    }
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
                let extension = file.split()[1];
                if (types.image.includes(extension)) {
                    json.assets.images.push(file);
                }
            })
            fs.readdir("./project/assets/snd", function (err, files) {
                files.forEach(file => {
                    let extension = file.split()[1];
                    if (types.sound.includes(extension)) {
                        json.assets.sounds.push(file);
                    }
                });
                fs.writeFile("./project/game.cfg.json", JSON.stringify(json));
            })
        })
    });
}
