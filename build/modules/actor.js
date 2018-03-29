"use strict";
class Actor {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    step() { }
    draw() { }
}
function def(...names) {
    names.forEach((name) => {
        act[name] = [];
    });
}
module.exports = {
    Actor: Actor,
    def: def
};
