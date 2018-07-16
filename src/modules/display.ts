// name: "display"
// desc: "..."
// expr: Viewport, Compiler, Layers

class Viewport {
    public element:any;
    public secondC:HTMLCanvasElement;
    public context:CanvasRenderingContext2D;
    public context2:CanvasRenderingContext2D;
    public scale:Vector;
    public size:Vector;
    public screen:Vector;
    private isMain:boolean;
    public ssize:number;

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
        this.secondC = document.createElement("canvas");
        //@ts-ignore
        this.context2 = this.secondC.getContext("2d");
        this.context.scale(1/1.5, 1/1.5);
        this.ssize = 0;
    } 

    resize(size:Vector, window:boolean = true):void {
        this.element.width = size.x;
        this.element.height = size.y;
        this.size = size;
        if (window) {
            this.screen = size;
            for (let i = 0; i<2; i++) {
                WINDOW.setContentSize(size.x, size.y);
            }    
        }
        this.update();
    }
    
    update():void {
        let sc = this.scale;
        let win = WINDOW.getContentBounds();
        let max = Math.max(this.size.x, this.size.y);
        this.screen = v(win.width, win.height);
        if (this.screen != sc) {
            Key.mupdated = false;
            if (this.screen.x  / this.screen.y > this.size.x / this.size.y) {
                this.scale = v(this.screen.y / this.size.y,this.screen.y / this.size.y);
            } else {
                this.scale = v(this.screen.x / this.size.x,this.screen.x / this.size.x);
            }
        } 
        this.element.width = this.size.x * this.scale.x;
        this.element.height = this.size.y * this.scale.y;
        this.secondC.width = this.secondC.height = this.ssize = max * 1.5;
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

    finalize():(() => any)[][] {
        for(let i = 0; i<this.temp.length; i++) {
            if (this.arr[this.temp[i].depth - this.min]) {
                this.arr[this.temp[i].depth - this.min].push(this.temp[i].fn);
            } else {
                this.arr[this.temp[i].depth - this.min] = [this.temp[i].fn];
            }
        }
        
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
        for(let i = 0; i<layers.arr.length; i++) {
            if(layers.arr[i]) {
                for(let e = 0; e<layers.arr[i].length; e++) {
                    layers.arr[i][e]();
                }
            }
        }
    }
}

module.exports = {
    Viewport:Viewport,
    Layers:Layers,
    Layer:Layer, 
    Compiler:Compiler
}