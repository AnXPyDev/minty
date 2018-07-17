const reqget:any = require; //minty-compile-ignore
const paths:any = reqget("../paths.json");
const fs:any = reqget("fs");
const electron:any = reqget("electron");

function obtain(path:string, scope:any = null):void {
    if(scope != null) {
        Object.assign(scope, reqget(path));
    } else {
        Object.assign(window, reqget(path)); 
    }
}

function loadscript(path:string):void {
    let scr = document.createElement("script");
    $MAIN.load.start();
    scr.src = path;
    scr.onload = function() {
        $MAIN.load.stop();
    }
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
    adt = dt = aps / tps;
    //requestAnimationFrame($MAIN.draw);
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
    onloaded:boolean,
    tick:() => void,
    draw:() => void,
    titleupdateloop:Loop,
    load:{
        all:number,
        done:number,
        pending:number,
        doneanim:boolean,
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

$MAIN.onloaded = false;

const GAME:{
    onload:() => void,
    onbeforetick:() => void
} = {
    onload() {},
    onbeforetick() {}
}

$MAIN.cfg = reqget(paths.mpx + "./minty.cfg.json");
$MAIN.game_cfg = reqget(paths.mpx + paths.project + "/game.cfg.json");
const ELECTRON:any = reqget("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();

// obtains all Minty modules
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
let ctx2:CanvasRenderingContext2D;

const act:any = {};
let cfg:any = {};
const img:any = {noimage:new Image()};
const snd:any = {};

let bck:any = {};
let ins:any = {};
let loop:any = [];
let camera:Camera = new Camera();
let scene:Scene = new Scene("default",v(),[],[],()=>{},()=>{});
let tick:number = 0;
let dt:number = 1;
let adt:number = 1;
let CGH:CGHandler = new CGHandler();
let cam_poly = new Polygon("rect");
cam_poly.set([[-1,-1],[1,-1],[1,1],[-1,1]]);


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
    WINDOW.setTitle(`${paths.project_name}`);
    vport = new Viewport("c0", true);
    ctx = vport.context2;
    ctx2 = vport.context;
    ctx.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    //@ts-ignore
    ctx.scaleNew = ctx.scale;
    ctx.scale = (x:number,y:number) => {
        //@ts-ignore
        ctx.scaleNew(x,y);
        ctx.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    }
    //@ts-ignore
    ctx2.scaleNew = ctx.scale;
    ctx2.scale = (x:number,y:number) => {
        //@ts-ignore
        ctx2.scaleNew(x,y);
        ctx2.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    }
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
    $MAIN.onloaded = true;
}

$MAIN.tick = function():void {
    $MAIN.tps.last = $MAIN.tps.now;
    tick ++;
    $MAIN.cLAY.reset();
    $MAIN.mLAY.reset();
    camera.update();
    Key.mouselog();
    GAME.onbeforetick();
    let bKeys = Object.keys(bck);
    for(let i = 0; i<bKeys.length; i++) {
        bck[bKeys[i]].update();
    }
    let iKeys = Object.keys(ins);
    for(let i = 0; i<iKeys.length; i++) {
        for(let e = 0; e<ins[iKeys[i]].length; e++) {
            ins[iKeys[i]][e] && ins[iKeys[i]][e].update();
        }
        ins[iKeys[i]].grid.reset();
        ins[iKeys[i]].grid.nextIndex();
    }
    for(let i = 0; i<iKeys.length; i++) {
        for(let e = 0; e < ins[iKeys[i]].length; e++) {
            if(!ins[iKeys[i]][e]) {
                ins[iKeys[i]].splice(e,1);
                e--;
            } else {
                ins[iKeys[i]][e].id = e;
            }
        }
    }


    for(let i = 0; i<loop.length; i++) {
        loop[i].update();
    }
    $MAIN.cLAY.finalize();
    $MAIN.mLAY.finalize();
    $MAIN.tps.now = Date.now();
    $MAIN.tps.total = Math.floor(1000 / ($MAIN.tps.now - $MAIN.tps.last));
    //dt = scene.tps / $MAIN.tps.total * adt;
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
    ctx.fillStyle = "black";
    ctx.fillRect(0 , 0, vport.ssize, vport.ssize);
    ctx.translate(-camera.pos.x + vport.ssize / 2, -camera.pos.y + vport.ssize / 2);
    $MAIN.cAPI.compile($MAIN.cLAY);
    ctx.restore();
    ctx2.save();
    ctx2.fillStyle = "white";
    ctx2.fillRect(0,0,vport.size.x, vport.size.y);
    ctx2.translate((vport.size.x * vport.scale.x) / 2, (vport.size.y * vport.scale.y) / 2);
    ctx2.rotate(camera.angle.rad);
    ctx2.drawImage(vport.secondC, -vport.secondC.width / 2 * camera.scale.x * vport.scale.x, -vport.secondC.height / 2 * camera.scale.y * vport.scale.y, vport.secondC.width * camera.scale.x * vport.scale.x, vport.secondC.height * camera.scale.y * vport.scale.y);
    ctx2.restore();
    if (!$MAIN.load.doneanim) {
        $MAIN.loadanim();
    }
    if(!$MAIN.mainloop == null) {
        requestAnimationFrame($MAIN.draw);
    }
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
            if (!$MAIN.onloaded) {   
                $MAIN.onload();
            } else {
                GAME.onload();
            }
        }
    },
    loading() {
        return this.done == this.all && this.pending == 0;
    }
}

function loadgame(pp:string) {
    let pco:number = 0;
    $MAIN.game_cfg.code.json.forEach((file:string) => {
        cfg[file.split(".")[0]] = reqget(paths.mpx + pp + "/code/" + file);
    });
    $MAIN.game_cfg.code.js.forEach((file:string) => {
        loadscript(paths.mpx + pp + "/code/" + file);
    })
    $MAIN.game_cfg.assets.images.forEach((file:string) => {
        pco++;
        preload("img", paths.mpx + pp + "/assets/img/" + file);
    })
    $MAIN.game_cfg.assets.sounds.forEach((file:string) => {
        pco++;
        preload("snd", paths.mpx + pp + "/assets/snd/" + file);
    })
}

loadgame(paths.project);

document.onreadystatechange = function():void {
    if (document.readyState == "complete") {
        if ($MAIN.load.loading() && $MAIN.load.all == 0 && !$MAIN.onloaded) {
            $MAIN.onload();
        }
    }
}
