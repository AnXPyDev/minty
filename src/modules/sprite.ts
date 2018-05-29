class Sprite {
    private img:ImageArray;
    public len:number;
    public index:number;
    public width:number;
    public loop:Loop;
    public fps:number;
    public attachments:any;

    constructor(imgname:string, len:number = 1, fps:number) {
        this.img = new ImageArray(imgname);
        this.len = len;
        this.index = 0;
        this.width = this.img.get().width / len;
        this.fps = fps;
        this.loop = new Loop(() => {
            this.index = wrap_np(this.index + 1, 0, this.len - 1);
        }, this.fps);
        this.attachments = {};
    }
    update() {
        if (this.fps != 0) {
            this.loop.update();
        }
    }
    draw(pos:Vector,size:Vector, angle:Angle = new Angle("rad", 0)):void {
        ctx.save();
        ctx.translate(pos.x,pos.y);
        ctx.rotate(angle.rad);
        ctx.drawImage(this.img.get(), this.index * this.width, 0, this.width, this.img.get().height, 0 - size.x / 2, 0 - size.y / 2, size.x, size.y);
        ctx.restore();
    }
    
}

class ImageArray {
    public img:HTMLImageElement[];
    public index:string;
    public numix:number;
    public keys:string[];
    constructor(...names:string[]) {
        this.img = names.map(name => img[name]);;
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
    set(index:string | number) {
        if (typeof index == "number") {
            this.numix = wrap(index, 0, this.keys.length - 1);
            this.index = this.keys[this.numix];
        } else {
            this.index = index;
            this.numix = this.keys.indexOf(index);
        }
    }
}

module.exports = {
    Sprite:Sprite,
    ImageArray:ImageArray
}