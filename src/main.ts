const reqget:any = require; //minty-compile-ignore
const paths:any = reqget("../paths.json");

function obtain(path:string, scope:any = null):void {
    if(scope != null) {
        Object.assign(scope, reqget(path));
    } else {
        Object.assign(window, reqget(path)); 
    }
}

function loadscript(path:string):void {
    let scr = document.createElement("script");
    scr.src = path;
    document.head.appendChild(scr);
} 

function preload(type:string, path:string):void {
    let pho:string[] = path.split("/");
    let name:string = pho[pho.length - 1].split(".")[0];
    if (type == "img") {
        $MAIN.load.start();
        img[name] = new Image();
        img[name].src = path;
        img[name].onload = function():void {
            $MAIN.load.stop();
        }
    } else if (type == "snd") {
        $MAIN.load.start();
        snd[name] = new Audio();
        snd[name].src = path;
        snd[name].oncanplaythrough = ():void => {
            $MAIN.load.stop();
            snd[name].oncanplaythrough = ():void => {};
        }
    }
}

let WINDOW:any;

function pause():void {
    if ($MAIN.mainloop) {
        clearInterval($MAIN.mainloop)
    }
    $MAIN.mainloop = null;
}

function resume(tps:number = scene.tps, aps:number = tps):void {
    //@ts-ignore
    pause();
    $MAIN.mainloop = setInterval($MAIN.tick, 1000 / tps);
    dt = aps / tps;
}

// @ts-ignore
const $MAIN:{
    cfg:any,
    game_cfg:any,
    logo:any,
    mainloop:any,
    cAPI:Compiler,
    cLAY:Layers,
    mAPI:MCompiler,
    mLAY:Layers,
    loadanim:() => void,
    onload:() => void,
    tick:() => void,
    draw:() => void,
    titleupdateloop:Loop,
    load:{
        all:number,
        done:number,
        pending:number,
        doneanim:boolean;
        stop:() => void,
        start:() => void,
        loading:() => boolean
    },
    fps:{
        last:number,
        now:number,
        total:number
    },
    tps:{
        last:number,
        now:number,
        total:number
    }
} = {};

//@ts-ignore
const GAME:{
    onload:() => void
} = {
    onload() {}
}

$MAIN.cfg = reqget(paths.mpx + "./minty.cfg.json");
$MAIN.game_cfg = reqget(paths.mpx + paths.project + "/game.cfg.json");
const ELECTRON:any = reqget("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();

// obtains all MAKEBA modules
$MAIN.cfg.modules.forEach((file:string) => {
    obtain(paths.mpx + "./compiled/modules/" + file + ".js");
});

$MAIN.logo = new Image(); $MAIN.logo.src = paths.mpx + "./icon/minty.svg";
$MAIN.logo.parts = [];
$MAIN.logo.parts[0] = new Image(); $MAIN.logo.parts[0].src = paths.mpx + "./icon/parts/1.svg";
$MAIN.logo.parts[1] = new Image(); $MAIN.logo.parts[1].src = paths.mpx + "./icon/parts/2.svg";

let vport:Viewport = new Viewport("null", false);
//@ts-ignore
let ctx:CanvasRenderingContext2D = document.createElement("canvas").getContext("2d");

const act:any = {};
const cfg:any = {};
const img:any = {noimage:new Image()};
const snd:any = {};

let bck:any = {};
let ins:any = {};
let camera:Camera = new Camera();
let scene:Scene = new Scene(v(),[],[],()=>{},()=>{});
let tick:number = 0;
let dt:number = 1;

$MAIN.cAPI = new Compiler;
$MAIN.cLAY = new Layers;
$MAIN.mAPI = new MCompiler;
$MAIN.mLAY = new Layers;

$MAIN.loadanim = getLoadAnim();

$MAIN.titleupdateloop = new Loop(
    function() {
        if ($MAIN.cfg.developer) {
            WINDOW.setTitle(`${paths.project_name} ` + $MAIN.cfg.version + "   fps: " + $MAIN.fps.total + "   tps: " + $MAIN.tps.total);
        }
    },15
)

$MAIN.onload = function() {
    vport = new Viewport("c0", true);
    ctx = vport.context;
    ctx.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    vport.resize(new Vector(600,600), true);
    requestAnimationFrame($MAIN.draw);
    if ($MAIN.cfg.developer) {
      console.warn("You Are In Developer Mode");
    }
    document.addEventListener("keydown", Key.add);
    document.addEventListener("keyup", Key.remove);
    vport.element.addEventListener("mousemove", Key.mouse);
    document.addEventListener("mousedown", Key.mousedown);
    document.addEventListener("mouseup", Key.mouseup);
    GAME.onload();
}

$MAIN.tick = function():void {
    $MAIN.tps.last = $MAIN.tps.now;
    tick ++;
    $MAIN.cLAY.reset();
    $MAIN.mLAY.reset();
    camera.update();
    Key.mouselog();
    for(let i in bck) {
        bck[i].update();
    }
    for(let i in ins) {
        for(let e in ins[i]) {
            ins[i][e] && ins[i][e].update();
        }
    }
    for(let i in ins) {
        for(let e = 0; e < ins[i].length; e++) {
            if(!ins[i][e]) {
                ins[i].splice(e,1);
                e--;
            } else {
                ins[i][e].id = e;
            }
        }
    }
    $MAIN.cLAY.finalize();
    $MAIN.mLAY.finalize();
    $MAIN.tps.now = Date.now();
    $MAIN.tps.total = Math.floor(1000 / ($MAIN.tps.now - $MAIN.tps.last));
    $MAIN.titleupdateloop.update();
    vport.update();
}

$MAIN.fps = {
    last: 0,
    now: 0,
    total: 0
}

$MAIN.tps = {
    last: 0,
    now: 0,
    total: 0
}


$MAIN.draw = function() {
    $MAIN.fps.last = $MAIN.fps.now;
    ctx.save();
    ctx.scale(vport.scale.x, vport.scale.y);
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0 , 0, vport.size.x, vport.size.y);
    ctx.restore();
    ctx.save();
    ctx.translate(-camera.pos.x + vport.size.x / 2, -camera.pos.y + vport.size.y / 2);
    ctx.scale(camera.scale.x, camera.scale.y);
    ctx.rotate(camera.angle.get("rad"));
    $MAIN.cAPI.compile($MAIN.cLAY);
    ctx.restore();
    ctx.save();
    if (!$MAIN.load.doneanim) {
        $MAIN.loadanim();
    }
    ctx.restore();
    ctx.restore();
    requestAnimationFrame($MAIN.draw);
    $MAIN.fps.now = Date.now();
    //@ts-ignore
    $MAIN.fps.total = Math.floor(1000 / ($MAIN.fps.now - $MAIN.fps.last));
}

$MAIN.load = {
    all: 0,
    done: 0,
    pending: 0,
    doneanim: false,
    start() {
        this.all ++;
        this.pending ++;
    },
    stop() {
        this.done ++;
        this.pending --;
        if ($MAIN.load.loading()) {
            $MAIN.onload();
        }
    },
    loading() {
        return this.done == this.all && this.pending == 0;
    }
}

$MAIN.game_cfg.code.json.forEach((file:string) => {
    cfg[file.split(".")[0]] = reqget(paths.mpx + paths.project + "/code/" + file);
});
$MAIN.game_cfg.code.js.forEach((file:string) => {
    loadscript(paths.mpx + paths.project + "/code/" + file);
})
$MAIN.game_cfg.assets.images.forEach((file:string) => {
    preload("img", paths.mpx + paths.project + "/assets/img/" + file);
})
$MAIN.game_cfg.assets.sounds.forEach((file:string) => {
    preload("snd", paths.mpx + paths.project + "/assets/snd/" + file);
})

document.onreadystatechange = function():void {
    if (document.readyState == "complete") {
        if ($MAIN.load.loading() && $MAIN.load.all == 0) {
            setTimeout($MAIN.onload, 100);
        }
    }
}

///