function obtain(path:string):void {
    //@ts-ignore
    Object.assign(window, require(path));
}

let WINDOW:any;

const $MAIN:any = {};

$MAIN.cfg = require("../minty.cfg.json");
const ELECTRON:any = require("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();

// Obtains all MAKEBA modules
$MAIN.cfg.modules.forEach((file:string) => {
    obtain("../build/modules/" + file + ".js");
});

$MAIN.logo = new Image(); $MAIN.logo.src = "../icon/minty.svg";
$MAIN.logo.parts = [];
$MAIN.logo.parts[0] = new Image(); $MAIN.logo.parts[0].src = "../icon/parts/1.svg";
$MAIN.logo.parts[1] = new Image(); $MAIN.logo.parts[1].src = "../icon/parts/2.svg";

let vport:Viewport;
let ctx:CanvasRenderingContext2D;

const act:any = {};

$MAIN.loadanim = getLoadAnim();

$MAIN.main = {
    onload() {
        vport = new Viewport("c0", true);
        ctx = vport.context;
        vport.resize(new Vector(600,600));
        requestAnimationFrame($MAIN.draw);
    }
}
$MAIN.step = function(td:number):number {
    
    for(let i in act) {
        for(let e in act[i]) {
            act[i][e].step();
        }
    }

    return 1; 
}

$MAIN.draw = function() {
    
    ctx.save();

    ctx.save();
    ctx.restore();
    if (true) {
        $MAIN.loadanim();
    }
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.font = "15px Arial";
    ctx.fillText($MAIN.cfg.name, 5, 15);
    ctx.fillText($MAIN.cfg.version, 5, 35);

    ctx.restore();
    requestAnimationFrame($MAIN.draw);

}



















document.onreadystatechange = function():void {
    if (document.readyState == "complete") {
        setTimeout($MAIN.main.onload,0);
    }
}
