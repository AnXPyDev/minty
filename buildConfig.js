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