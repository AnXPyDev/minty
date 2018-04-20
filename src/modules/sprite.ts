class Sprite {
    private img:ImageArray;
    public len:number;
    public index:number;
    public width:number;
    public loop:Loop;
    public fps:number;
    constructor(imgname:string, len:number = 1, fps:number) {
        this.img = new ImageArray(imgname);
        this.len = len;
        this.index = 0;
        this.width = this.img.get().width / len;
        this.fps = fps;
        this.loop = new Loop(() => {
            this.index = wrap_np(this.index + 1, 0, this.len - 1);
        }, this.fps);
    }
    update() {
        if (this.fps != 0) {
            this.loop.update();
        }
    }
    draw(pos:Vector,size:Vector):void {
        ctx.drawImage(this.img.get(), this.index * this.width, 0, this.width, this.img.get().height, pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
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