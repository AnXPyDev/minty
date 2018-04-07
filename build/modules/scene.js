"use strict";
class Scene {
    constructor(act, bck, onload, onbeforeload) {
        this.index = 0;
        this.onload = onload;
        this.onbeforeload = onbeforeload;
        this.act = act;
        this.bck = bck;
    }
    load() {
        this.onbeforeload();
        for (let i in ins) {
            for (let e in ins[i]) {
                if (!ins[i][e].persistant) {
                    ins[i][e].destroy();
                }
            }
        }
        let actKeys = Object.keys(this.act);
        for (let i in actKeys) {
            for (let e in ins[i]) {
                Instance.spawn(actKeys[i], ins[i][e]);
            }
        }
        bck = {};
        let bckKeys = Object.keys(this.bck);
        for (let i in bckKeys) {
        }
    }
    setNext() {
    }
}
module.exports = {};
