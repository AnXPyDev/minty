class TileSheet {
    public size:Vector;
    public names:any;
    public img:ImageArray;
    constructor(imgnames:string[], size:Vector) {
        this.size = size;
        this.names = {};
        this.img = new ImageArray(...imgnames);
    } 
    defineTile(name:string, pos:Vector):void {
        this.names[name] = pos;
    }
    drawTile(name:string, pos:Vector, size:Vector, angle:Angle = new Angle("deg", 0)):void {
        ctx.save();
        ctx.translate(pos.x,pos.y);
        ctx.rotate(angle.rad);
        ctx.scale(size.x / this.size.x, size.y / this.size.y);
        ctx.drawImage(this.img.get(), this.size.x * this.names[name].x, this.size.y * this.names[name].y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        ctx.restore();
        
    }
}

module.exports = {
    TileSheet:TileSheet
}