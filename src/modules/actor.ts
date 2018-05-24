class Actor {
    public pos:Vector;
    public size:Vector;
    public angle:Angle;
    public sprite:Sprite;
    public mask:Polygon;
    public id:number;
    public isPersistant:boolean;
    public tickrate:number;
    public depth:number;
    public mdepth:number;
    public loops:any;
    public isCollidable:boolean;


    constructor() {
        this.pos = v();
        this.size = v();
        this.angle = new Angle("deg", 0);
        this.sprite = new Sprite("noimage",1,0);
        this.mask = new Polygon();
        this.id = 0;
        this.isPersistant = false;
        this.tickrate = 1;
        this.depth = 1;
        this.mdepth = 1;
        this.loops = {};
        this.isCollidable = true;
    }
    tick():void {}
    draw():void {}
    update():void {
        for(let i in this.loops) {
            this.loops[i].update();
        }
        if (tick * 100 % Math.floor(this.tickrate * 100) == 0) {
            this.tick();
        }
        $MAIN.cLAY.insert(new Layer(this.depth, ():void => {this.draw()}));
        $MAIN.mLAY.insert(new Layer(this.mdepth, ():boolean => {return this.mousedown()}));
        
    }
    mousedown():boolean {
        return false;
    }
    loop(name:string, callback:() => void, tps:number):void {
        this.loops[name] = new Loop(callback, tps);
    }
    destroyloop(name:string) {
        delete this.loops[name];
    }
} 

const Instance:{
    spawn:(name:string, Args:any) => number,
    destroy:(name:string, id:number) => void,
    mod:(name:string, merge:any, id:string | number) => void,
    get:(name:string, id:number) => any
} = {
    spawn(name:string, Args:any):number {
        let id:number = ins[name].length;
        let pho:any = new act[name](...Args);
        pho.id = id;
        ins[name].push(pho);
        return id;
    },
    destroy(name:string, id:number):void {
        delete ins[name][id];
    },
    mod(name:string, merge:any, id:string | number = "all"):void {
        if (typeof id == "number") {
            //@ts-ignore
            Object.assign(ins[name][id], merge);
        } else {
            for(let i in ins[name]) {
                //@ts-ignore
                Object.assign(ins[name][i], merge);
            }
        }
    },
    get(name:string, id:number):any {
        return ins[name][id];
    }
}


function def(name:string, actor:any):void {
    act[name] = actor;
    ins[name] = [];
}

class Loop {
    public callback:() => any;
    public tps:number;
    constructor(callback:() => any, tps:number) {
        this.tps = tps;
        this.callback = callback;   
    }
    update():void {
        if (tick * dt % this.tps == 0) {
            this.callback();
        }
    }
}

module.exports = {
    Actor:Actor,
    Instance:Instance,
    def:def,
    Loop:Loop
}

