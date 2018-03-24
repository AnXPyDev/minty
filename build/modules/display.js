"use strict";
// name: "display"
// desc: "..."
// expr: Viewport
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
        WINDOW.setSize(size.x + 6, size.y + 29);
    }
}
module.exports = {
    Viewport: Viewport
};
