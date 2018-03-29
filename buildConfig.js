{
    const fs = require("fs");
    const json = require("./base/refference.json");
    fs.readdir("./build/modules", function(err, files) {
        files.forEach(file => {
            json.modules.push(file.split(".")[0]);
        });
        fs.writeFile("./minty.cfg.json", JSON.stringify(json));
    });
}