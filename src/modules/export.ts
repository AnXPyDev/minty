function exportObjectAsJson(x:any, filename:string) {
    let json = JSON.stringify(x);
    if (!`${paths.project}/exports`){ 
        fs.mkdirSync(`${paths.project}/exports`); 
    } 
    fs.writeFileSync(`${paths.project}/exports/${filename}.json`, json);   
}

module.exports = {
    exportObjectAsJson:exportObjectAsJson
}