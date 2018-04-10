class Sprite {
    private imgname:string;
    public len:number;
    public index:number;
    constructor(imgname:string, len:number = 1) {
        this.imgname = imgname;
        this.len = len;
        this.index = 0;
    }
    draw(pos:Vector,size:Vector):void {
        ctx.drawImage(img[this.imgname], pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
    }
}

module.exports = {
    Sprite:Sprite
}