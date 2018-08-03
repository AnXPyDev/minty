function exportObjectAsJson(x:any, filename:string) {
    let json = JSON.stringify(x);
    if (!fs.existsSync(`${paths.project}/exports`)){ 
        fs.mkdirSync(`${paths.project}/exports`); 
    } 
    let split = filename.split("/");
    let path = ""

    if(split[0] != "..") {

        for(let i = 0; i < split.length - 1; i++) {
            path += split[i] + "/";
            if(!fs.existsSync(`${paths.project}/exports/${path}`)) {
                fs.mkdirSync(`${paths.project}/exports/${path}`);
            }
        }
    }

    fs.writeFileSync(`${paths.project}/exports/${filename}.json`, json);   
}



module.exports = {
    exportObjectAsJson:exportObjectAsJson
}