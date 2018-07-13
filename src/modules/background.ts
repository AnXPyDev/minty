class Background {
    public type:string;
    public img:ImageArray;
    public color:string;
    public x:number;y:number;
    public depth:number;
    public alpha:number;
    public scale:Vector;
    public off:Vector;
    public spd:Vector;
    public offset:Vector;
    public aoff:Vector;
    private types:string[];

    constructor(imgname:string[], type:string, color:string = "white") {
        this.img = new ImageArray(...imgname);
        this.types = ["solid", "single", "fullscreen", "tiled"];
        this.type = (():string => {
            //@ts-ignore
            if (this.types.includes(type)) {
                return type;
            }
            return "solid";
        })();
        this.color = color;
        this.x = 0;
        this.y = 0;
        this.scale = new Vector(1,1);
        this.off = new Vector();
        this.spd = new Vector();
        this.depth = -15;
        this.alpha = 1;
        this.offset = v();
        this.aoff = v();
    }
    draw():void {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if(this.type == "tiled") {
            let vsize = vport.ssize *  (1 / Math.max(camera.scale.x, camera.scale.y));
            let goff:Vector = new Vector(
                    (camera.pos.x / (this.img.get().width * this.scale.x) - Math.floor(camera.pos.x / (this.img.get().width * this.scale.x))) * (this.img.get().width * this.scale.x) + this.offset.x,
                    (camera.pos.y / (this.img.get().height * this.scale.y) - Math.floor(camera.pos.y / (this.img.get().height * this.scale.y))) * (this.img.get().height * this.scale.y) + this.offset.y
                )
            for(let i:number = -Math.floor((vsize / 2) / (this.img.get().width * this.scale.x)) -2; i < Math.floor(vsize / (this.img.get().width * this.scale.x)) + 2; i++) {
                for(let e:number = -Math.floor((vsize / 2) / (this.img.get().height * this.scale.y)) -2; e < Math.floor(vsize / (this.img.get().height * this.scale.y)) + 2; e++) {
                    ctx.drawImage(this.img.get(), 
                        i * this.img.get().width * this.scale.x + camera.pos.x - goff.x + this.off.x - 1,  
                        e * this.img.get().height * this.scale.y + camera.pos.y - goff.y + this.off.y - 1, 
                        this.img.get().width * this.scale.x + 1, 
                        this.img.get().height * this.scale.y + 1)
                }
            }
        } else if (this.type == "fullscreen") {
            ctx.drawImage(this.img.get(), -vport.size.x / 2, -vport.size.y / 2, vport.size.x, vport.size.y);
        } else if (this.type == "solid") {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(-vport.ssize, -vport.ssize, vport.ssize * 2, vport.ssize * 2);
            ctx.restore();
        }
        ctx.restore();
    }
    update():void {
        if(this.type == "tiled") {
            this.off.x = wrap(this.off.x + this.spd.x * dt, 0, this.img.get().width * this.scale.x);
            this.off.y = wrap(this.off.y + this.spd.y * dt, 0, this.img.get().height * this.scale.y);
            this.offset.x = (this.aoff.x - Math.floor(this.aoff.x / this.img.get().width) * this.img.get().width) * this.scale.x;
            this.offset.y = (this.aoff.y - Math.floor(this.aoff.y / this.img.get().height) * this.img.get().height) * this.scale.y;
        }
        $MAIN.cLAY.insert(new Layer(this.depth, () => {return this.draw()}));
    }
    setScale(scale:Vector):void {
        this.scale = scale;
    }
    setScroll(spd:Vector):void {
        this.spd = spd;
    }
    setOffset(off:Vector):void {
        this.aoff = off;
    }
}

module.exports = {
    Background:Background
}