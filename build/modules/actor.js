"use strict";
class Actor {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.id = 0;
        this.persistant = false;
    }
    step() { }
    draw() { }
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
function def(name, act) {
    act[name] = act;
    ins[name] = [];
}
module.exports = {
    Actor: Actor,
    Instance: Instance,
    def: def
};
