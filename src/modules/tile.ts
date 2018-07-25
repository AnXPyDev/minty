class TileSheet {
    public size:Vector;
    public names:any;
    public img:ImageArray;
    constructor(imgnames:string[], size:Vector) {
        this.size = size;
        this.names = {};
        this.img = new ImageArray(...imgnames);
    } 
    defineTile(name:string, pos:Vector, depth:number):void {
        this.names[name] = [pos,depth];
    }
    drawTile(name:string, pos:Vector, size:Vector, angle:Angle = new Angle("deg", 0)):void {
        ctx.save();
        ctx.translate(pos.x,pos.y);
        ctx.rotate(angle.rad);
        ctx.scale(size.x / this.size.x, size.y / this.size.y);
        ctx.drawImage(this.img.get(), this.size.x * this.names[name][0].x, this.size.y * this.names[name][0].y, this.size.x, this.size.y, -this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        ctx.restore();
    }
}

function defTile(name:string, imgname:string, size:Vector, names:[string,number][][]) {
    til[name] = new TileSheet([imgname], size);
    for(let y = 0; y<names.length; y++) {
        for(let x = 0; x<names[y].length; x++) {
            til[name].defineTile(names[y][x][0], v(x,y), names[y][x][1]);
        }
    }
}

module.exports = {
    TileSheet:TileSheet,
    defTile:defTile
}