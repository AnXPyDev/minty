// name: "display"
// desc: "..."
// expr: Viewport, Compiler, Layers

class Viewport {
    public element:any;
    public context:CanvasRenderingContext2D;
    public scale:Vector;
    public size:Vector;
    public screen:Vector;
    private isMain:boolean;

    constructor(id:string, main:boolean) {
        this.element = document.getElementById(id);
        if(this.element) {
            this.context = this.element.getContext("2d");
            this.isMain = main;
            this.scale = new Vector(1,1);
            this.size = new Vector(this.element.width, this.element.height);
            this.screen = this.size;
        } else {
            //@ts-ignore
            this.context = document.createElement("canvas").getContext("2d");
            this.isMain = false;
            this.scale = v();
            this.size = v();
            this.screen = v();
        }
        
    } 

    resize(size:Vector, window:boolean = true):void {
        this.element.width = size.x;
        this.element.height = size.y;
        this.size = size;
        if (window) {
            this.screen = size;
            for (let i in [0,1]) {
                WINDOW.setContentSize(size.x, size.y);
            }    
        }
        this.update();
    }
    
    update():void {
        let sc = this.scale;
        let win = WINDOW.getContentBounds();
        this.screen = v(win.width, win.height);
        if (this.screen != sc) {
            Key.mupdated = false;
            if (this.screen.x > this.screen.y) {
                this.scale = v(this.screen.y / this.size.y,this.screen.y / this.size.y);
            } else {
                this.scale = v(this.screen.x / this.size.x  , this.screen.x / this.size.x);
            }
        } 
        this.element.width = this.size.x * this.scale.x;
        this.element.height = this.size.y * this.scale.y;
        
    } 
}

class Layers {
    public arr:(() => void)[][];
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

    finalize():(() => void)[][] {
        this.temp.forEach((layer:Layer) => {
            if (this.arr[layer.depth - this.min]) {
                this.arr[layer.depth - this.min].push(layer.fn);
            } else {
                this.arr[layer.depth - this.min] = [layer.fn];
            }
        })
        
        return this.arr;
    }

    reset():void {
        this.arr = [];
        this.temp = [];
        this.min = 0;
    }
}

class Layer {
    public depth:number;
    public fn:() => void;

    constructor(depth:number, fn:() => void) {
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