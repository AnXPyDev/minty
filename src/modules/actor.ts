class Actor {
    public x:number;
    public y:number;
    public id:number;
    public persistant:boolean;
    public tickrate:number;
    public depth:number;
    public mdepth:number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.id = 0;
        this.persistant = false;
        this.tickrate = 1;
        this.depth = 1;
        this.mdepth = 1;
    }
    tick():void {}
    draw():void {}
    update():void {
        if (tick * 100 % Math.floor(this.tickrate * 100) == 0) {
            this.tick();
        }
        $MAIN.cLAY.insert(new Layer(this.depth, ():void => {this.draw()}));
        $MAIN.mLAY.insert(new Layer(this.mdepth, ():boolean => {return this.mousedown()}));
        
    }
    mousedown():boolean {
        return false;
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
        for(let i:number = id; i < ins[name].length; i ++) {
            ins[name][i].id --;
        }
    },
    mod(name:string, merge:any, id:string | number = ""):void {
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
        if (tick % this.tps == 0) {
            this.callback();
        }
    }
}
module.exports = {
    Actor:Actor,
    Instance:Instance,
    def:def
}

