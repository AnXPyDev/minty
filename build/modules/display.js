"use strict";
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
            WINDOW.setSize(size.x + 6, size.y + 29);
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
module.exports = {
    Viewport: Viewport,
    Layers: Layers,
    Layer: Layer,
    Compiler: Compiler
};
