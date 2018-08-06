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
        ctx.setAlpha(this.alpha);
        if(this.type == "tiled") {
            let vsize = Math.max(vport.size.x, vport.size.y) *  (1 / Math.max(camera.scale.x, camera.scale.y));
            let im = this.img.get();
            let goff:Vector = new Vector(
                    (camera.pos.x / (im.width * this.scale.x) - Math.floor(camera.pos.x / (im.width * this.scale.x))) * (im.width * this.scale.x) + this.offset.x,
                    (camera.pos.y / (im.height * this.scale.y) - Math.floor(camera.pos.y / (im.height * this.scale.y))) * (im.height * this.scale.y) + this.offset.y
                )
            for(let i:number = -Math.floor((vsize / 2) / (im.width * this.scale.x)) -2; i < Math.floor((vsize / 2) / (im.width * this.scale.x)) + 2; i++) {
                for(let e:number = -Math.floor((vsize / 2) / (im.height * this.scale.y)) -2; e < Math.floor((vsize / 2) / (im.height * this.scale.y)) + 2; e++) {
                    ctx.save()
                    ctx.translate(v(i * im.width * this.scale.x + camera.pos.x - goff.x + this.off.x,e * im.height * this.scale.y + camera.pos.y - goff.y + this.off.y));
                    ctx.scale(this.scale);
                    ctx.drawImage(im, 
                        v(-im.width /2,  
                        -im.height / 2), 
                        v(im.width, 
                        im.height))
                    ctx.restore();   
                }
            }
        } else if (this.type == "fullscreen") {
            ctx.drawImage(this.img.get(), v(-vport.size.x / 2, -vport.size.y / 2), vport.size);
        } else if (this.type == "solid") {
            let max = Math.max(vport.size.x, vport.size.y);
            ctx.save();
            ctx.setFillStyle(this.color);
            ctx.fillRect(v(-max, -max), v(max * 2, max * 2));
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