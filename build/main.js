"use strict";
function obtain(path) {
    //@ts-ignore
    Object.assign(window, require(path));
}
let WINDOW;
const $MAKEBA__cfg = require("../makeba.cfg.json");
const ELECTRON = require("electron");
WINDOW = ELECTRON.remote.getCurrentWindow();
$MAKEBA__cfg.modules.forEach((file) => {
    obtain("../build/modules/" + file + ".js");
});
let vport;
let ctx;
let x = 0, y = 0;
function draw() {
    x++;
    y++;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, vport.element.width, vport.element.height);
    ctx.fillStyle = "black";
    ctx.fillRect(x - 20, y - 20, 40, 40);
    requestAnimationFrame(draw);
}
const $MAKEBA__main = {
    onload() {
        vport = new Viewport("c0", true);
        ctx = vport.context;
        vport.resize(new Vector(400, 400));
        vport.resize(new Vector(400, 400));
        requestAnimationFrame(draw);
    }
};
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setTimeout($MAKEBA__main.onload, 0);
    }
};
