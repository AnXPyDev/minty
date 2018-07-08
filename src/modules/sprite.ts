class Sprite {
    public img:ImageArray;
    public len:number;
    public index:number;
    public width:number;
    public loop:Loop;
    public fps:number;
    public attachments:any;
    public compiler:Compiler;
    public layers:Layers;

    constructor(imgname:string[], len:number = 1, fps:number) {
        this.img = new ImageArray(...imgname);
        this.len = len;
        this.index = 0;
        this.width = this.img.get().width / len;
        this.fps = fps;
        this.loop = new Loop(() => {
            this.index = wrap_np(this.index + 1, 0, this.len - 1);
        }, this.fps);
        this.attachments = {};
        this.compiler = new Compiler();
        this.layers = new Layers();
    }
    update():void {
        if (this.fps != 0) {
            this.loop.update();
        }
        this.layers.reset();
        let keys = Object.keys(this.attachments);
        for(let i = 0; i<keys.length; i++) {
            this.layers.insert(new Layer(this.attachments[keys[i]].depth, () => {this.attachments[keys[i]].draw()}))}
        this.layers.insert(new Layer(0, () => {
            let sz = this.img.getsize();
            ctx.drawImage(this.img.get(), this.index * this.width, 0, this.width, this.img.get().height, -sz.x / (this.len * 2), -sz.y / 2, sz.x / this.len, sz.y);
        }))
        this.layers.finalize();
    }
    draw(pos:Vector,size:Vector, angle:Angle = new Angle("rad", 0), ...args:any[]):void {
        let sz:Vector = this.img.getsize();
        ctx.save();
        ctx.translate(pos.x,pos.y);
        ctx.rotate(angle.rad);
        ctx.scale(size.x / (sz.x / this.len), size.y / sz.y);
        this.compiler.compile(this.layers)
        ctx.restore();
    }
    attach(name:string, imgname:string[], len:number = 1, fps:number, depth:number, offset:Vector, angle:Angle, scale:Vector = v(1,1)):void {
        this.attachments[name] = new SpriteAttachment(imgname, len, fps, depth, offset,angle,scale);
    }
    
}

class SpriteAttachment extends Sprite {
    public offset:Vector;
    public angle:Angle;
    public scale:Vector;
    public depth:number;

    constructor(imgname:string[], len:number = 1, fps:number, depth:number = 0, offset:Vector = v(), angle:Angle = new Angle("rad", 0), scale:Vector = v(1,1)) {
        super(imgname, len, fps);
        this.offset = offset;
        this.angle = angle;
        this.scale = scale;
        this.depth = depth;
    }
    update() {
        if (this.fps != 0) {
            this.loop.update();
        }
        
    }
    draw(...args:any[]) {
        let sz = this.img.getsize();
        ctx.save();
        ctx.translate(this.offset.x,this.offset.y);
        ctx.rotate(this.angle.rad);
        ctx.scale(this.scale.x,this.scale.y);
        ctx.drawImage(this.img.get(), this.index * this.width, 0, this.width, this.img.get().height, -sz.x / (this.len * 2) + this.offset.x, -sz.y / 2 + this.offset.y, sz.x / this.len, sz.y);
        ctx.restore();
    }
} 

class ImageArray {
    public img:HTMLImageElement[];
    public index:string;
    public numix:number;
    public keys:string[];
    constructor(...names:string[]) {
        this.img = names.map(name => img[name]);
        this.keys = names;
        this.index = names[0];
        this.numix = 0;
    }
    get(index:string = this.index):HTMLImageElement {
        return this.img[this.numix];
    }
    move(by:number):void {
        this.numix = wrap(this.numix + by, 0, this.keys.length - 1);
        this.index = this.keys[this.numix];
    }
    set(index:string | number):void {
        if (typeof index == "number") {
            this.numix = wrap(index, 0, this.keys.length - 1);
            this.index = this.keys[this.numix];
        } else {
            this.index = index;
            this.numix = this.keys.indexOf(index);
        }
    }
    getsize():Vector {
        return v(this.img[this.numix].width, this.img[this.numix].height);
    }
    push(imgname:string):void {
        this.img.push(img[imgname]);
        this.keys.push(imgname);
    }   
}

class SprCompiler extends Compiler{
    compile(layers:Layers, ...args:any[]) {
        for(let i = 0; i<layers.arr.length; i++) {
            if(layers.arr[i]) {
                for(let e = 0; e<layers.arr[i].length; e++) {
                    //@ts-ignore
                    layers.arr[i][e](...args);
                }
            }
        }
    }
}

module.exports = {
    Sprite:Sprite,
    ImageArray:ImageArray,
    SpriteAttachment:SpriteAttachment,
    SprCompiler:SprCompiler
}