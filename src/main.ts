function obtain(path:string):void {
    //@ts-ignore
    Object.assign(window, require(path));
}

let WINDOW:any;

const $MAKEBA__cfg:any = require("../makeba.cfg.json");
const ELECTRON:any = require("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();
$MAKEBA__cfg.modules.forEach((file:string) => {
    obtain("../build/modules/" + file + ".js");
});

let vport:Viewport;
let ctx:CanvasRenderingContext2D;

const $MAKEBA__main = {
    onload() {
        vport = new Viewport("c0", true);
        ctx = vport.context;
        vport.resize(new Vector(400, 400));
        vport.resize(new Vector(400, 400));
    }
}

document.onreadystatechange = function():void {
    if (document.readyState == "complete") {
        setTimeout($MAKEBA__main.onload,0);
    }
}
