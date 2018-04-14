
class Background {
    constructor(imgname, type, color = "white") {
        this.img = img[imgname];
        this.types = ["solid", "single", "fullscreen", "tiled"];
        this.type = (() => {
            //@ts-ignore
            if (this.types.includes(type)) {
                return type;
            }
            return "solid";
        })();
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.scale = new Vector(1, 1);
        this.off = new Vector();
        this.spd = new Vector();
    }
    draw() {
        if (this.type == "tiled") {
            let goff = new Vector((camera.pos.x / this.img.width - Math.floor(camera.pos.x / this.img.width)) * this.img.width, (camera.pos.y / this.img.height - Math.floor(camera.pos.y / this.img.height)) * this.img.height);
            for (let i = -2; i < Math.floor(vport.size.x / (this.img.width * this.scale.x)) + 2; i++) {
                for (let e = -2; e < Math.floor(vport.size.y / (this.img.height * this.scale.y)) + 2; e++) {
                    ctx.drawImage(this.img, i * this.img.width * this.scale.x + camera.pos.x - goff.x + this.off.x, e * this.img.height * this.scale.y + camera.pos.y - goff.y + this.off.y, this.img.width * this.scale.x, this.img.height * this.scale.y);
                }
            }
        }
        else if (this.type == "fullscreen") {
            ctx.drawImage(this.img, 0, 0, vport.size.x, vport.size.y);
        }
        else if (this.type == "solid") {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, vport.size.x, vport.size.y);
            ctx.restore();
        }
    }
    update() {
        this.off.x = wrap(this.off.x + this.spd.x, 0, this.img.width * this.scale.x);
        this.off.y = wrap(this.off.y + this.spd.y, 0, this.img.height * this.scale.y);
    }
    setScale(scale) {
        this.scale = scale;
    }
    setScroll(spd) {
        this.spd = spd;
    }
}

class Actor {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.id = 0;
        this.persistant = false;
        this.tickrate = 1;
        this.depth = 1;
        this.mdepth = 1;
    }
    tick() { }
    draw() { }
    update() {
        if (tick * 100 % Math.floor(this.tickrate * 100) == 0) {
            this.tick();
        }
        $MAIN.cLAY.insert(new Layer(this.depth, () => { this.draw(); }));
        $MAIN.mLAY.insert(new Layer(this.mdepth, () => { return this.mousedown(); }));
    }
    mousedown() {
        return false;
    }
}
const Instance = {
    spawn(name, Args) {
        let id = ins[name].length;
        let pho = new act[name](...Args);
        pho.id = id;
        ins[name].push(pho);
        return id;
    },
    destroy(name, id) {
        delete ins[name][id];
        for (let i = id; i < ins[name].length; i++) {
            ins[name][i].id--;
        }
    },
    mod(name, merge, id = "") {
        if (typeof id == "number") {
            //@ts-ignore
            Object.assign(ins[name][id], merge);
        }
        else {
            for (let i in ins[name]) {
                //@ts-ignore
                Object.assign(ins[name][i], merge);
            }
        }
    },
    get(name, id) {
        return ins[name][id];
    }
};
function def(name, actor) {
    act[name] = actor;
    ins[name] = [];
}
class Loop {
    constructor(callback, tps) {
        this.tps = tps;
        this.callback = callback;
    }
    update() {
        if (tick % this.tps == 0) {
            this.callback();
        }
    }
}

class Camera {
    constructor() {
        this.pos = new Vector();
    }
}

// name: "display"
// desc: "..."
// expr: Viewport, Compiler, Layers
class Viewport {
    constructor(id, main) {
        this.element = document.getElementById(id);
        this.context = this.element.getContext("2d");
        this.isMain = main;
        this.scale = new Vector(1, 1);
        this.size = new Vector(this.element.width, this.element.height);
    }
    resize(size) {
        this.element.width = size.x;
        this.element.height = size.y;
        this.size = new Vector(size.x, size.y);
        for (let i in [0, 1]) {
            WINDOW.setSize(size.x, size.y, true);
        }
    }
}
class Layers {
    constructor() {
        this.arr = [];
        this.temp = [];
        this.min = 0;
    }
    insert(layer) {
        if (layer.depth < this.min) {
            this.min = layer.depth;
        }
        this.temp.push(layer);
    }
    finalize() {
        this.temp.forEach((layer) => {
            if (this.arr[layer.depth + this.min]) {
                this.arr[layer.depth + this.min].push(layer.fn);
            }
            else {
                this.arr[layer.depth + this.min] = [layer.fn];
            }
        });
        return this.arr;
    }
    reset() {
        this.arr = [];
        this.temp = [];
    }
}
class Layer {
    constructor(depth, fn) {
        this.depth = depth;
        this.fn = fn;
    }
}
class Compiler {
    constructor() { }
    ;
    compile(layers) {
        layers.arr.forEach((layer) => {
            layer.forEach((fn) => {
                fn();
            });
        });
    }
}

function getLoadAnim() {
    let i0 = $MAIN.logo.parts[0];
    let angle = 0;
    let i1 = $MAIN.logo.parts[1];
    let szm = 6;
    let alpha = 1;
    return function () {
        ctx.save();
        if ($MAIN.load.done == $MAIN.load.all) {
            alpha -= 0.01;
            if (alpha <= 0) {
                $MAIN.load.doneanim = true;
            }
        }
        alpha = clamp(alpha, 0, 1);
        let vsz = vport.size;
        let sz = (Math.min(vsz.x, vsz.y) / 3) * 2 / szm;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, vsz.x, vsz.y);
        ctx.translate(vsz.x / szm * (szm - 1), vsz.y / szm * (szm - 1));
        //@ts-ignore
        angle = 2 * Math.PI * Math.sin(new Date() / 1000);
        //if (angle < -2 * Math.PI) {angle = 0};
        ctx.save();
        ctx.rotate(angle);
        ctx.drawImage(i0, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.save();
        ctx.rotate(-angle);
        ctx.drawImage(i1, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.restore();
    };
}


class Scene {
    constructor(act, bck, onload, onbeforeload, tps = 60) {
        this.index = 0;
        this.onload = onload;
        this.onbeforeload = onbeforeload;
        this.act = act;
        this.bck = bck;
        this.tps = tps;
        this.next = null;
    }
    load() {
        this.onbeforeload();
        scene = this;
        let insKeys = Object.keys(ins);
        for (let i in ins) {
            for (let e in ins[i]) {
                if (!ins[i][e].persistant) {
                    //@ts-ignore
                    Instance.destroy(insKeys[i], e);
                }
            }
        }
        let actKeys = Object.keys(this.act);
        for (let i in actKeys) {
            for (let e in this.act[actKeys[i]]) {
                Instance.spawn(actKeys[i], this.act[actKeys[i]][e]);
            }
        }
        bck = {};
        let bckKeys = Object.keys(this.bck);
        for (let i in bckKeys) {
            let pho = this.bck[bckKeys[i]];
            //@ts-ignore
            bck[bckKeys[i]] = new Background(...pho);
        }
        this.onload();
    }
    setNext(scene) {
        this.next = scene;
    }
    loadnext() {
        //@ts-ignore
        this.next.load();
    }
}

// name: "math"
// desc: "..."
// exports: Vector 
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
class Angle {
    constructor(defaulttype = "rad", value) {
        this.types = ["deg", "rad"];
        this.default = "rad";
        if (defaulttype == this.types[0] || defaulttype == this.types[1]) {
            this.default = defaulttype;
        }
        this.deg = function (type) {
            if (type == "rad") {
                return value * 180 / Math.PI;
            }
            return value;
        }(this.default);
        this.rad = function (type) {
            if (type == "deg") {
                return value * Math.PI / 180;
            }
            return value;
        }(this.default);
    }
    set(value, type = this.default) {
        this.deg = function (type) {
            if (type == "rad") {
                return value * 180 / Math.PI;
            }
            return value;
        }(type);
        this.rad = function (type) {
            if (type == "deg") {
                return value * Math.PI / 180;
            }
            return value;
        }(type);
    }
    to(value, type) {
        if (type == "rad") {
            return value * 180 / Math.PI;
        }
        else if (type == "deg") {
            return value * Math.PI / 180;
        }
        return value;
    }
    get() {
        if (this.default == "rad") {
            return this.rad;
        }
        else if (this.default == "deg") {
            return this.deg;
        }
        return 1;
    }
}

obtain("../build/modules/display.js");
obtain("../build/modules/math.js");
//@ts-ignore
const Key = {};
Key.holder = [];
Key.check = function (kc) {
    return Key.holder[kc] ? true : false;
};
Key.mouse = function (evt) {
    MClient.x = evt.clientX;
    MClient.y = evt.clientY;
};
Key.mouselog = function () {
    Mouse.x = MClient.x + camera.pos.x;
    Mouse.y = MClient.y + camera.pos.y;
};
Key.mousedown = function (evt) {
    Key.add({ key: "mouse" });
    $MAIN.mAPI.compile($MAIN.mLAY);
};
Key.mouseup = function (evt) {
    Key.remove({ key: "mouse" });
};
Key.add = function (evt) {
    Key.holder[evt.key] = true;
};
Key.remove = function (evt) {
    Key.holder[evt.key] = false;
};
//@ts-ignore
const Mouse = new Vector();
const MClient = new Vector();
class MCompiler extends Compiler {
    constructor() {
        super();
    }
    compile(layers) {
        for (let i in layers.arr) {
            for (let e in layers.arr[i]) {
                if (layers.arr[i][e]()) {
                    return;
                }
            }
        }
    }
}

class Sprite {
    constructor(imgname, len = 1, fps) {
        this.img = img[imgname];
        this.len = len;
        this.index = 0;
        this.width = this.img.width / len;
        this.fps = fps;
        this.loop = new Loop(() => {
            this.index = wrap_np(this.index + 1, 0, this.len - 1);
        }, this.fps);
    }
    update() {
        if (this.fps != 0) {
            this.loop.update();
        }
    }
    draw(pos, size) {
        ctx.drawImage(this.img, this.index * this.width, 0, this.width, this.img.height, pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
    }
}

function clamp(val, min, max) {
    if (val < min) {
        return min;
    }
    else if (val > max) {
        return max;
    }
    else {
        return val;
    }
}
function wrap(val, min, max) {
    if (val < min) {
        return max - (min - val);
    }
    else if (val > max) {
        return min + (val - max);
    }
    else {
        return val;
    }
}
function wrap_np(val, min, max) {
    if (val < min) {
        return max;
    }
    else if (val > max) {
        return min;
    }
    else {
        return val;
    }
}
function flip(val, min, max) {
    return min - val + max;
}
function lerp(val, val2, perc, floor = false, floorby = 0) {
    if (floor) {
        return Math.floor((val + (val2 - val) * perc) * Math.pow(10, floorby)) / Math.pow(10, floorby);
    }
    return (val + (val2 - val) * perc);
}
function approach(val, val2, amt) {
    if (val2 < val) {
        return clamp(val - amt, val - val2, val);
    }
    else {
        return clamp(val + amt, val, val2);
    }
}
