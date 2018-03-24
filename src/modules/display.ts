// name: "display"
// desc: "..."
// expr: Viewport, Compiler, Layers

class Viewport {
    public element:any;
    public context:CanvasRenderingContext2D;
    public scale:Vector;
    public size:Vector;
    private isMain:boolean;

    constructor(id:string, main:boolean) {
        this.element = document.getElementById(id);
        this.context = this.element.getContext("2d");
        this.isMain = main;
        this.scale = new Vector(1,1);
        this.size = new Vector(this.element.width, this.element.height);
    } 

    resize(size:Vector):void {
        this.element.width = size.x;
        this.element.height = size.y;
        this.size = new Vector(size.x, size.y);
        WINDOW.setSize(size.x + 6, size.y + 29);
    }
}

class Layers {
    public arr:Function[][];
    public temp:Layer[];
    public min:number;

    constructor() {
        this.arr = [];
        this.temp = [];
        this.min = 0;
    }

    insert(layer:Layer):void {
        if (layer.depth < this.min) {
            this.min = layer.depth;
        }
        this.temp.push(layer);
    }

    finalize():Function[][] {
        this.temp.forEach((layer:Layer) => {
            if (this.arr[layer.depth + this.min]) {
                this.arr[layer.depth + this.min].push(layer.fn);
            } else {
                this.arr[layer.depth + this.min] = [layer.fn];
            }
        })
        
        return this.arr;
    }

    reset():void {
        this.arr = [];
        this.temp = [];
    }
}

class Layer {
    public depth:number;
    public fn:Function;

    constructor(depth:number, fn:Function) {
        this.depth = depth;
        this.fn = fn;
    }
}

class Compiler {
    constructor() {};
    compile(layers:Layers) {
        layers.arr.forEach((layer:Function[]) => {
            layer.forEach((fn:Function) => {
                fn();
            });
        });
    }
}

module.exports = {
    Viewport:Viewport,
    Layers:Layers,
    Layer:Layer, 
    Compiler:Compiler
}