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
    public isHidden:boolean;
    public isDrawedOutsideCamera:boolean;
    public name:string;


    constructor(pos:Vector = v(), name:string) {
        this.pos = pos;
        this.size = v();
        this.angle = new Angle("deg", 0);
        this.sprite = new Sprite(["noimage"],1,0);
        this.mask = new Polygon();
        this.id = 0;
        this.isPersistant = false;
        this.tickrate = 1;
        this.depth = 1;
        this.mdepth = 1;
        this.loops = {};
        this.isCollidable = true;
        this.name = name;
        this.isHidden = false;
        this.isDrawedOutsideCamera = false;
    }
    tick():void {}
    draw():void {}
    update():void {
        if(!$MAIN.edit) {
            for(let i in this.loops) {
                this.loops[i].update();
            }
            if (tick * 100 % Math.floor(this.tickrate * 100) == 0) {
                this.tick();
            }
            $MAIN.mLAY.insert(new Layer(this.mdepth, ():boolean => {return this.mousedown()}));
        }
        if (!this.isHidden) {
            $MAIN.cLAY.insert(new Layer(this.depth, ():void => {this.draw()}));
        }
        
        
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
    valueOf() {
        return this.name; 
    }
} 

const Instance:{
    spawn:(name:string, Args:any) => number,
    destroy:(name:string, id:number) => void,
    mod:(name:string, merge:any, id:string | number) => void,
    get:(name:string, id:number) => any,
    filter:(traits:string[], parent:string) => string[]
} = {
    spawn(name:string, Args:any):number {
        let id:number = ins[name].length;
        let pho:any = new act[name](...Args);
        pho.id = id;
        if(Args[0] != undefined) {
            pho.pos.x = Args[0].x;
            pho.pos.y = Args[0].y;
        }
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
    },
    filter(traits:string[] = [], parent:string = ""):string[] {
        let result:string[] = [];
        if(parent) {
            result.concat(inheritanceTree.byParent[parent]);
        } else if (traits.length > 0) {
            let count:any = {};
            traits.forEach(x => {
                inheritanceTree.byTrait[x].forEach((y:any) => {
                    if (count[y]) {
                        count[y] ++;
                    } else {
                        count[y] = 1;
                    }
                })
            })
            let cKeys = Object.keys(count)
            cKeys.forEach((x:any) => {
                if(count[x] == traits.length) {
                    result.push(x)
                }
            })
        }
        return result;        
    }
}


function def(name:string, actor:any, parent:string = "", traits:string[] = []):void {
    act[name] = actor;
    ins[name] = [];
    traits.forEach(x => {
        if(inheritanceTree.byTrait[x]) {
            inheritanceTree.byTrait[x].push(name);
        } else {
            inheritanceTree.byTrait[x] = [name];
        }
    })
    if(parent) {
        if(inheritanceTree.byParent[parent]) {
            inheritanceTree.byParent[parent].push(name);
        } else {
            inheritanceTree.byParent[parent] = [name];
        }
    }
}

const inheritanceTree:{
    byParent:any,
    byTrait:any
} = {
    byParent: {},
    byTrait: {}
}

class Loop {
    public callback:() => any;
    public tps:number;
    public id:number;
    constructor(callback:() => any, tps:number) {
        this.tps = tps;
        this.id = 0;
        this.callback = callback;   
    }
    update():void {
        if (tick * dt % this.tps == 0) {
            this.callback();
        }
    }
}

function filterIns(insNames:string[]):any[] {
    let result:any[] = [];
    insNames.forEach(x => {
        result.concat(ins[x]);
    })
    return result;
}

module.exports = {
    Actor:Actor,
    Instance:Instance,
    def:def,
    Loop:Loop,
    filterIns:filterIns
}

