"use strict";
function obtain(path) {
    // @ts-ignore
    Object.assign(window, require(path));
}
function loadscript(path) {
    let scr = document.createElement("script");
    scr.src = path;
    document.head.appendChild(scr);
}
function preload(type, path) {
    let name = path.split("/")[-1].split(".")[0];
    if (type == "img") {
        $MAIN.load.start();
        img[name] = new Image();
        img[name].src = path;
        img[name].onload = function () {
            $MAIN.load.stop();
        };
    }
    else if (type == "snd") {
        $MAIN.load.start();
        snd[name] = new Audio();
        snd[name].src = path;
        snd[name].oncanplaythrough = () => {
            $MAIN.load.stop();
            snd[name].oncanplaythrough = () => { };
        };
    }
}
let WINDOW;
// @ts-ignore
const $MAIN = {};
$MAIN.cfg = require("../minty.cfg.json");
$MAIN.game_cfg = require("../project/game.cfg.json");
const ELECTRON = require("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();
// obtains all MAKEBA modules
$MAIN.cfg.modules.forEach((file) => {
    obtain("../build/modules/" + file + ".js");
});
$MAIN.logo = new Image();
$MAIN.logo.src = "../icon/minty.svg";
$MAIN.logo.parts = [];
$MAIN.logo.parts[0] = new Image();
$MAIN.logo.parts[0].src = "../icon/parts/1.svg";
$MAIN.logo.parts[1] = new Image();
$MAIN.logo.parts[1].src = "../icon/parts/2.svg";
let vport;
let ctx;
const act = {};
const ins = {};
const cfg = {};
const img = {};
const snd = {};
let bck = {};
let scene;
$MAIN.loadanim = getLoadAnim();
$MAIN.onload = function () {
    vport = new Viewport("c0", true);
    ctx = vport.context;
    vport.resize(new Vector(600, 600));
    requestAnimationFrame($MAIN.draw);
    if ($MAIN.cfg.developer) {
        console.warn("You Are In Developer Mode");
    }
    $MAIN.game_cfg.assets.images.forEach((file) => {
        preload("img", "../project/assets/" + file);
    });
    $MAIN.game_cfg.assets.sounds.forEach((file) => {
        preload("snd", "../project/assets/" + file);
    });
    $MAIN.game_cfg.code.json.forEach((file) => {
        cfg[file.split(".")[0]] = require("../project/code/" + file);
    });
    $MAIN.game_cfg.code.js.forEach((file) => {
        loadscript("../project/code/" + file);
    });
};
$MAIN.step = function (td) {
    let start = new Date();
    for (let i in act) {
        for (let e in act[i]) {
            act[i][e].step();
        }
    }
    let end = new Date();
    return end - start;
};
$MAIN.draw = function () {
    ctx.save();
    if (!$MAIN.load.loading()) {
        $MAIN.loadanim();
    }
    if ($MAIN.cfg.developer) {
        ctx.fillStyle = "black";
        ctx.textAlign = "left";
        ctx.font = "15px Arial";
        ctx.fillText($MAIN.cfg.name, 5, 15);
        ctx.fillText($MAIN.cfg.version, 5, 35);
    }
    ctx.restore();
    requestAnimationFrame($MAIN.draw);
};
$MAIN.load = {
    all: 0,
    done: 0,
    pending: 0,
    start() {
        this.all++;
        this.pending++;
    },
    stop() {
        this.done++;
        this.pending--;
    },
    loading() {
        return this.done == this.all && this.pending == 0;
    }
};
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setTimeout($MAIN.onload, 0);
    }
};
