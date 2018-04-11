class Sprite {
    private img:HTMLImageElement;
    public len:number;
    public index:number;
    public width:number;
    public loop:Loop;
    public fps:number;
    constructor(imgname:string, len:number = 1, fps:number) {
        this.img = img[imgname];
        this.len = len;
        this.index = 0;
        this.width = this.img.width / len;
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
        ctx.drawImage(this.img, this.index * this.width, 0, this.width, this.img.height, pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
    }
}

module.exports = {
    Sprite:Sprite
}