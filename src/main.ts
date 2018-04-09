function obtain(path:string):void {
    // @ts-ignore
    Object.assign(window, require(path));
}

function loadscript(path:string):void {
    let scr = document.createElement("script");
    scr.src = path;
    document.head.appendChild(scr);
} 

function preload(type:string, path:string):void {
    let name:string = path.split("/")[-1].split(".")[0]; 
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
    clearInterval($MAIN.mainloop);
}

function resume(tps:number = scene.tps):void {
    //@ts-ignore
    $MAIN.mainloop = setInterval($MAIN.tick, 1000 / 60);
}

// @ts-ignore
const $MAIN:{
    cfg:any,
    game_cfg:any,
    logo:any,
    mainloop:number,
    cAPI:Compiler,
    cLAY:Layers,
    loadanim:() => void,
    onload:() => void,
    tick:() => void,
    draw:() => void,
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
        last:Date,
        now:Date,
        total:number
    },
    tps:{
        last:Date,
        now:Date,
        total:number
    }
} = {};

//@ts-ignore
const GAME:{
    onload:() => void
} = {
    onload() {}
}

$MAIN.cfg = require("../minty.cfg.json");
$MAIN.game_cfg = require("../project/game.cfg.json");
const ELECTRON:any = require("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();

// obtains all MAKEBA modules
$MAIN.cfg.modules.forEach((file:string) => {
    obtain("../build/modules/" + file + ".js");
});

$MAIN.game_cfg.code.json.forEach((file:string) => {
    cfg[file.split(".")[0]] = require("../project/code/" + file);
});
$MAIN.game_cfg.code.js.forEach((file:string) => {
    loadscript("../project/code/" + file);
})

$MAIN.logo = new Image(); $MAIN.logo.src = "../icon/minty.svg";
$MAIN.logo.parts = [];
$MAIN.logo.parts[0] = new Image(); $MAIN.logo.parts[0].src = "../icon/parts/1.svg";
$MAIN.logo.parts[1] = new Image(); $MAIN.logo.parts[1].src = "../icon/parts/2.svg";

let vport:Viewport;
let ctx:CanvasRenderingContext2D;

const act:any = {};
const cfg:any = {};
const img:any = {};
const snd:any = {};

let bck:any = {};
let ins:any = {};
let scene:Scene;
let tick:number = 0;

$MAIN.cAPI = new Compiler;
$MAIN.cLAY = new Layers;

$MAIN.loadanim = getLoadAnim();

$MAIN.onload = function() {
    vport = new Viewport("c0", true);
    ctx = vport.context;
    vport.resize(new Vector(600,600));
    requestAnimationFrame($MAIN.draw);
    if ($MAIN.cfg.developer) {
      console.warn("You Are In Developer Mode");
    }
    $MAIN.game_cfg.assets.images.forEach((file:string) => {
        preload("img", "../project/assets/" + file);
    })
    $MAIN.game_cfg.assets.sounds.forEach((file:string) => {
        preload("snd", "../project/assets/" + file);
    })
    window.addEventListener("keydown", Key.add);
    window.addEventListener("keyup", Key.remove);
    window.addEventListener("mousemove", Key.mouse);
    GAME.onload();
    resume();
}

$MAIN.tick = function():void {
    $MAIN.tps.last = $MAIN.tps.now;
    tick ++;
    $MAIN.cLAY.reset();
    for(let i in ins) {
        for(let e in ins[i]) {
            ins[i][e].update();
        }
    }
    $MAIN.cLAY.finalize();
    $MAIN.tps.now = new Date();
    //@ts-ignore
    $MAIN.tps.total = Math.floor(1000 / ($MAIN.tps.now - $MAIN.tps.last));
}

$MAIN.fps = {
    last: new Date(),
    now: new Date(),
    total: 0
}

$MAIN.tps = {
    last: new Date(),
    now: new Date(),
    total: 0
}


$MAIN.draw = function() {
    $MAIN.fps.last = $MAIN.fps.now;
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0 , 0, vport.size.x, vport.size.y);
    $MAIN.cAPI.compile($MAIN.cLAY);
    if (!$MAIN.load.doneanim) {
        $MAIN.loadanim();
    }
    if ($MAIN.cfg.developer) {
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.font = "15px Arial";
        ctx.fillText($MAIN.cfg.name, 5, 15);
        ctx.fillText($MAIN.cfg.version, 5, 35);
        //@ts-ignore
        ctx.fillText("fps: " + $MAIN.fps.total, 5, 55);
        //@ts-ignore
        ctx.fillText("tps: " + $MAIN.tps.total, 5, 75);
    }
    ctx.restore();
    requestAnimationFrame($MAIN.draw);
    $MAIN.fps.now = new Date();
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

document.onreadystatechange = function():void {
    if (document.readyState == "complete") {
        if ($MAIN.load.loading()) {
            setTimeout($MAIN.onload, 100);
        }
    }
}

///