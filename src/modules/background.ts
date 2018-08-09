class Background {
    public type:string;
    public img:Sprite;
    public color:string;
    public x:number;y:number;
    public depth:number;
    public alpha:number;
    public scale:Vector;
    public off:Vector;
    public spd:Vector;
    public offset:Vector;
    public aoff:Vector;
    public margin:Vector;
    public pos:Vector;
    public angle:Angle;
    private types:string[];

    constructor(sprite:[string[], number, number], type:string, color:string = "white") {
        this.img = new Sprite(sprite[0], sprite[1], sprite[2]);
        this.types = ["solid", "single", "fullscreen", "tiled", "htiled", "vtiled"];
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
        this.angle = new Angle("deg", 0);
        this.margin = v();
        this.offset = v();
        this.aoff = v();
        this.pos = v();
    }
    draw(pos = camera.pos):void {
        ctx.save();
        ctx.setAlpha(this.alpha);
        ctx.translate(pos);
        ctx.rotate(this.angle);
        let dir = this.angle.dir();

        if(this.type == "tiled") {
            let vsize = Math.max(vport.size.x, vport.size.y) *  (1 / Math.max(camera.scale.x * vport.scale.x * vport.zoomFactor , camera.scale.y * vport.scale.y * vport.zoomFactor));
            let im = v(this.img.width, this.img.img.get().height);
            let goff:Vector = new Vector(
                    (pos.x / ((im.x + this.margin.x) * this.scale.x) - Math.floor(pos.x / ((im.x + this.margin.x) * this.scale.x))) * ((im.x + this.margin.x) * this.scale.x) + this.offset.x,
                    (pos.y / ((im.y+ this.margin.y) * this.scale.y) - Math.floor(pos.y / ((im.y+ this.margin.y) * this.scale.y))) * ((im.y+ this.margin.y) * this.scale.y) + this.offset.y
                )
            goff.rotate(new Angle("deg", -this.angle.deg));
            for(let i:number = -Math.floor((vsize / 2) / ((im.x + this.margin.x) * this.scale.x)) -2; i < Math.floor((vsize / 2) / ((im.x + this.margin.x) * this.scale.x)) + 2; i++) {
                for(let e:number = -Math.floor((vsize / 2) / ((im.y+ this.margin.y) * this.scale.y)) -2; e < Math.floor((vsize / 2) / ((im.y+ this.margin.y) * this.scale.y)) + 2; e++) {
                    ctx.save()
                    ctx.translate(v(i * (im.x + this.margin.x) * this.scale.x - goff.x + this.off.x + this.pos.x,e * (im.y+ this.margin.y) * this.scale.y - goff.y + this.off.y + this.pos.y));
                    ctx.scale(this.scale);
                    this.eachDraw();
                    this.img.draw(v(), v(im.x, im.y));
                    ctx.restore();   
                }
            }
        } else if (this.type == "htiled") {
            let vsize = Math.max(vport.size.x, vport.size.y) *  (1 / Math.max(camera.scale.x * vport.scale.x * vport.zoomFactor , camera.scale.y * vport.scale.y * vport.zoomFactor));
            let im = v(this.img.width, this.img.img.get().height);
            let goff:Vector = new Vector(
                    (pos.x / ((im.x + this.margin.x) * this.scale.x) - Math.floor(pos.x / ((im.x + this.margin.x) * this.scale.x))) * ((im.x + this.margin.x) * this.scale.x) + this.offset.x,
                    (pos.y / ((im.y+ this.margin.y) * this.scale.y) - Math.floor(pos.y / ((im.y+ this.margin.y) * this.scale.y))) * ((im.y+ this.margin.y) * this.scale.y) + this.offset.y
                );
            goff.rotate(new Angle("deg", -this.angle.deg));
            let e = 0;
            for(let i:number = -Math.floor((vsize / 2) / ((im.x + this.margin.x) * this.scale.x)) -2; i < Math.floor((vsize / 2) / ((im.x + this.margin.x) * this.scale.x)) + 2; i++) {
                ctx.save()
                ctx.translate(v(i * (im.x + this.margin.x) * this.scale.x - goff.x + this.off.x + this.pos.x,e * (im.y+ this.margin.y) * this.scale.y - goff.y + this.off.y + this.pos.y));
                ctx.scale(this.scale);
                this.eachDraw();
                this.img.draw(v(), v(im.x, im.y));
                ctx.restore();   
            }
        } else if (this.type == "vtiled") {
            let vsize = Math.max(vport.size.x, vport.size.y) *  (1 / Math.max(camera.scale.x * vport.scale.x * vport.zoomFactor , camera.scale.y * vport.scale.y * vport.zoomFactor));
            let im = v(this.img.width, this.img.img.get().height);
            let goff:Vector = new Vector(
                    (pos.x / ((im.x + this.margin.x) * this.scale.x) - Math.floor(pos.x / ((im.x + this.margin.x) * this.scale.x))) * ((im.x + this.margin.x) * this.scale.x) + this.offset.x,
                    (pos.y / ((im.y+ this.margin.y) * this.scale.y) - Math.floor(pos.y / ((im.y+ this.margin.y) * this.scale.y))) * ((im.y+ this.margin.y) * this.scale.y) + this.offset.y
                )
            goff.rotate(new Angle("deg", -this.angle.deg));
            let i = 0;
            for(let e:number = -Math.floor((vsize / 2) / ((im.y+ this.margin.y) * this.scale.y)) -2; e < Math.floor((vsize / 2) / ((im.y+ this.margin.y) * this.scale.y)) + 2; e++) {
                ctx.save()
                ctx.translate(v(i * (im.x + this.margin.x) * this.scale.x - goff.x + this.off.x + this.pos.x,e * (im.y+ this.margin.y) * this.scale.y - goff.y + this.off.y + this.pos.y));
                ctx.scale(this.scale);
                this.eachDraw();
                this.img.draw(v(), v(im.x, im.y));
                ctx.restore();   
            }
        } else if (this.type == "fullscreen") {
            this.img.draw(v(), vport.size);
        } else if (this.type == "solid") {
            let max = Math.max(vport.size.x, vport.size.y);
            ctx.save();
            ctx.setFillStyle(this.color);
            this.eachDraw();
            ctx.fillRect(v(-max, -max), v(max * 2, max * 2));
            ctx.restore();
        }
        ctx.restore();
    }
    update(pos = camera.pos):void {
        if(this.type == "tiled" || this.type == "htiled" || this.type == "vtiled") {
            this.off.x = wrap(this.off.x + this.spd.x * dt, 0, (this.img.width + this.margin.x) * this.scale.x);
            this.off.y = wrap(this.off.y + this.spd.y * dt, 0, (this.img.img.get().height + this.margin.y) * this.scale.y);
            this.offset.x = (this.aoff.x - Math.floor(this.aoff.x / (this.img.width + this.margin.x)) * (this.img.width + this.margin.x)) * this.scale.x;
            this.offset.y = (this.aoff.y - Math.floor(this.aoff.y / (this.img.img.get().height + this.margin.y)) * (this.img.img.get().height + this.margin.y)) * this.scale.y;
        }
        this.img.update();
        $MAIN.cLAY.insert(new Layer(this.depth, () => {return this.draw(pos)}));
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
    setPos(pos:Vector):void {
        this.pos = pos;
    }
    eachDraw():void {}
}

module.exports = {
    Background:Background
}