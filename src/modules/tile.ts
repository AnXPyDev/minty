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
        ctx.translate(pos);
        ctx.rotate(angle);
        ctx.scale(v(size.x / this.size.x, size.y / this.size.y));
        ctx.drawImage(this.img.get(), v(this.size.x * this.names[name][0].x, this.size.y * this.names[name][0].y), this.size, v(-this.size.x / 2, -this.size.y / 2), this.size);
        ctx.restore();
    }
}

class Tile {
    public size:Vector;
    public pos:Vector;
    public name:string;
    public subname:string;
    public mask:Polygon;
    constructor(name:string, subname:string, size: Vector, pos:Vector) {
        this.size = size;
        this.pos = pos;
        this.name = name;
        this.subname = subname;
        this.mask = new Polygon("rect");
        this.mask.set([[-1,-1],[1,-1],[1,1],[-1,1]]);
        this.mask.size(this.size);
        this.mask.center(this.pos);
    }
    update() {
        if(this.mask.collidesRect(ins.cameraBounds[0].morphedMask)) {
            $MAIN.cLAY.insert(new Layer(til[this.name].names[this.subname][1], () => {
                til[this.name].drawTile(this.subname, this.pos, this.size);
            }));
        }
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
    Tile:Tile,
    defTile:defTile
}