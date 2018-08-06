const reqget:any = require; //minty-compile-ignore
const paths:any = reqget("../compiled/paths.json");
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
    load:{
        all:number,
        done:number,
        pending:number,
        doneanim:boolean,
        stop:() => void,
        start:() => void,
        loading:() => boolean
    },
    fps:FpsCounter
    tps:FpsCounter
} = {};

$MAIN.onloaded = false;

const GAME:{
    onload:() => void,
    onbeforetick:() => void
} = {
    onload() {},
    onbeforetick() {}
}

$MAIN.cfg = reqget(paths.mpx + "/compiled/minty.cfg.json");
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
let ctx:CContext;

const act:any = {};
const til:any = {};
let cfg:any = {};
const img:any = {noimage:new Image()};
const snd:any = {};

let bck:any = {};
let ins:any = {};
let tileins:any = {};
let loop:any = [];
let camera:Camera = new Camera();
let scene:Scene = new Scene("default",v(),[],[],[],()=>{},()=>{});
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

$MAIN.onload = function() {
    WINDOW.setTitle(`${paths.project_name}`);
    vport = new Viewport("c0", true);
    ctx = vport.context;
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
    $MAIN.tps.before();
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
    let tKeys = Object.keys(tileins);
    for(let i = 0; i<tKeys.length; i++) {
        let tKeys2 = Object.keys(tileins[tKeys[i]]);
        for(let e = 0; e< tKeys2.length; e++) {
            for(let t = 0; t<tileins[tKeys[i]][tKeys2[e]].length; t++) {
                $MAIN.cLAY.insert(new Layer(til[tKeys[i]].names[tKeys2[e]][1], () => {
                    til[tKeys[i]].drawTile(tKeys2[e],tileins[tKeys[i]][tKeys2[e]][t][0],tileins[tKeys[i]][tKeys2[e]][t][1]);
                }));
            }
        }
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
    $MAIN.tps.after();
    vport.update();
}

$MAIN.fps = new FpsCounter("FPS", "cyan");

$MAIN.tps = new FpsCounter("TPS", "magenta");


$MAIN.draw = function() {
    $MAIN.fps.before();
    ctx.save();
    ctx.translate(v((vport.size.x * vport.scale.x * vport.zoomFactor) / 2, (vport.size.y * vport.scale.x * vport.zoomFactor) / 2));
    ctx.rotate(camera.angle);
    ctx.scale(v(camera.scale.x * vport.scale.x * vport.zoomFactor, camera.scale.y * vport.scale.y * vport.zoomFactor));
    ctx.translate(v(-camera.pos.x, -camera.pos.y));
    $MAIN.cAPI.compile($MAIN.cLAY);
    ctx.restore();
    if($MAIN.cfg.developer) {
        $MAIN.tps.draw(0);
        $MAIN.fps.draw(1);
    }

    if (!$MAIN.load.doneanim) {
        $MAIN.loadanim();
    }
    $MAIN.fps.after();
    //@ts-ignore
    requestAnimationFrame($MAIN.draw);
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
        cfg[file.split(".")[0]] = reqget(paths.mpx + pp + "/config/" + file);
    });
    $MAIN.cfg.packages.forEach((file:string) => {
        loadscript(paths.mpx + "./src/packages/" + file + ".js");
    })
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
