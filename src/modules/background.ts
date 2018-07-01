class Background {
    public type:string;
    public img:HTMLImageElement;
    public color:string;
    public x:number;y:number;
    public depth:number;
    public alpha:number;
    public scale:Vector;
    public off:Vector;
    public spd:Vector;
    private types:string[];

    constructor(imgname:string, type:string, color:string = "white") {
        this.img = img[imgname];
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
    }
    draw():void {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        if(this.type == "tiled") {
            let goff:Vector = new Vector(
                    (camera.pos.x / (this.img.width * this.scale.x) - Math.floor(camera.pos.x / (this.img.width * this.scale.x))) * (this.img.width * this.scale.x),
                    (camera.pos.y / (this.img.height * this.scale.y) - Math.floor(camera.pos.y / (this.img.height * this.scale.y))) * (this.img.height * this.scale.y),
                )
            for(let i:number = -Math.floor((vport.size.x / 2) / (this.img.width * this.scale.x)) -2; i < Math.floor(vport.size.x / (this.img.width * this.scale.x)) + 2; i++) {
                for(let e:number = -Math.floor((vport.size.y / 2) / (this.img.height * this.scale.y)) -2; e < Math.floor(vport.size.y / (this.img.height * this.scale.y)) + 2; e++) {
                    ctx.drawImage(this.img, 
                        i * this.img.width * this.scale.x + camera.pos.x - goff.x + this.off.x - 1,  
                        e * this.img.height * this.scale.y + camera.pos.y - goff.y + this.off.y - 1, 
                        this.img.width * this.scale.x + 1, 
                        this.img.height * this.scale.y + 1)
                }
            }
        } else if (this.type == "fullscreen") {
            ctx.drawImage(this.img, 0, 0, vport.size.x, vport.size.y);
        } else if (this.type == "solid") {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, vport.size.x, vport.size.y);
            ctx.restore();
        }
        ctx.restore();
    }
    update():void {
        this.off.x = wrap(this.off.x + this.spd.x * dt, 0, this.img.width * this.scale.x);
        this.off.y = wrap(this.off.y + this.spd.y * dt, 0, this.img.height * this.scale.y);
        $MAIN.cLAY.insert(new Layer(this.depth, () => {return this.draw()}));
    }
    setScale(scale:Vector):void {
        this.scale = scale;
    }
    setScroll(spd:Vector):void {
        this.spd = spd;
    }
}

module.exports = {
    Background:Background
}