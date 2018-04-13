class Background {
    public type:string;
    public img:HTMLImageElement;
    public color:string;
    public x:number;y:number;
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
    }
    draw():void {
        if(this.type == "tiled") {
            for(let i:number = -2; i < Math.floor(vport.size.x / (this.img.width * this.scale.x)) + 2; i++) {
                for(let e:number = -2; e < Math.floor(vport.size.y / (this.img.height * this.scale.y)) + 2; e++) {
                    ctx.drawImage(this.img, 
                        i * this.img.width * this.scale.x + camera.pos.x + this.off.x,  
                        e * this.img.height * this.scale.y + camera.pos.y + this.off.y, 
                        this.img.width * this.scale.x, 
                        this.img.height * this.scale.y)
                }
            }
        }
    }
    update():void {
        this.off.x = wrap(this.off.x + this.spd.x, 0, this.img.width * this.scale.x);
        this.off.y = wrap(this.off.y + this.spd.y, 0, this.img.height * this.scale.y);
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