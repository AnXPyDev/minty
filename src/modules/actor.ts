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
    public GUIdepth:number;
    public mdepth:number;
    public loops:any;
    public isCollidable:boolean;
    public isHidden:boolean;
    public isDrawedOutsideCamera:boolean;
    public name:string;
    public spatialpos:{min:Vector, max:Vector};
    public morphedMask:Polygon;
    public isPaused:boolean;
    public isRoundedPosAfterTick:boolean;
    public isDrawingGUI:boolean;


    constructor(pos:Vector = v(), name:string) {
        this.pos = pos;
        this.size = v();
        this.angle = new Angle("deg", 0);
        this.sprite = new Sprite(["noimage"],1,0);
        this.mask = new Polygon("rect");
        this.mask.set([[-1,-1],[1,-1],[1,1],[-1,1]]);
        this.id = 0;
        this.isPersistant = false;
        this.tickrate = scene.tps;
        this.depth = 1;
        this.mdepth = 1;
        this.GUIdepth = 1;
        this.loops = {};
        this.isCollidable = true;
        this.name = name;
        this.isHidden = false;
        this.isDrawedOutsideCamera = false;
        this.spatialpos = {min:v(), max:v()};
        this.morphedMask = new Polygon();
        this.isPaused = false;
        this.isRoundedPosAfterTick = true;
        this.isDrawingGUI = false;
    }
    preTick():void {}
    tick():void {}
    postTick():void {}
    draw():void {}
    drawGUI():void {}
    update():void {
        if(!this.isPaused) {
            this.preTick();
            let lKeys = Object.keys(this.loops);
            for(let i = 0; i<lKeys.length; i++) {
                this.loops[lKeys[i]].update();
            }

            if (tick * 100 % Math.floor((scene.tps / this.tickrate) * 100) == 0) {
                this.tick();
                if(this.isRoundedPosAfterTick) {
                    this.pos.x = Math.round(this.pos.x);
                    this.pos.y = Math.round(this.pos.y);
                }
            }
            this.morphedMask = MorphPolygon(this.mask, this);
            this.spatialpos = CGH.calculateBlocks(this.morphedMask);
            ins[this.name].grid.insert(this.spatialpos, this.id);
            $MAIN.mLAY.insert(new Layer(this.mdepth, ():boolean => {return this.mousedown()}));
            
            if (!this.isHidden) {
                $MAIN.cLAY.insert(new Layer(this.depth, ():void => {this.draw()}));
                if(this.isDrawingGUI) {
                    $MAIN.cLAY_GUI.insert(new Layer(this.GUIdepth, ():void => {this.drawGUI()}));
                }
            }
            this.postTick();
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
    afterConstructor() {
        this.morphedMask = MorphPolygon(this.mask, this);
        this.spatialpos = CGH.calculateBlocks(this.morphedMask);
        ins[this.name].grid.insert(this.spatialpos, this.id);
    }
} 

const Instance:{
    spawn:(name:string, Args:any) => number,
    destroy:(name:string, id:number) => void,
    mod:(name:string, merge:any, id:string | number) => void,
    get:(name:string, id:number) => any,
    filter:(traits:string[]) => string[]
} = {
    spawn(name:string, Args:any[]):number {
        let id:number = ins[name].length;
        let pho:Actor = new act[name](...Args);
        pho.id = id;
        if(pho.isCollidable) {pho.afterConstructor()}
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
            for(let i = 0; i<ins[name].length; i++) {
                //@ts-ignore
                Object.assign(ins[name][i], merge);
            }
        }
    },
    get(name:string, id:number):any {
        return ins[name][id];
    },
    filter(traits:string[] = []):string[] {
        let result:string[] = [];
        if (traits.length > 0) {
            let count:any = {};
            for(let i = 0; i<traits.length; i++) {
                inheritanceTree.byTrait[traits[i]] ? null : inheritanceTree.byTrait[traits[i]] = [];
                for(let e = 0; e < inheritanceTree.byTrait[traits[i]].length; e++) {
                    if (count[inheritanceTree.byTrait[traits[i]][e]]) {
                        count[inheritanceTree.byTrait[traits[i]][e]] ++;
                    } else {
                        count[inheritanceTree.byTrait[traits[i]][e]] = 1;
                    }
                }
            }
            let cKeys = Object.keys(count)
            for(let i = 0; i < cKeys.length; i++) {
                if(count[cKeys[i]] == traits.length) {
                    result.push(cKeys[i])
                }
            }
        }
        return result;        
    }
}


function def(name:string, actor:any, traits:string[] = []):void {
    act[name] = actor;
    ins[name] = [];
    ins[name].grid = new CollisionGrid();
    for(let i = 0; i<traits.length; i++) {
        if(inheritanceTree.byTrait[traits[i]]) {
            inheritanceTree.byTrait[traits[i]].push(name);
        } else {
            inheritanceTree.byTrait[traits[i]] = [name];
        }
    }
}

const inheritanceTree:{
    byTrait:any
} = {
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
        if (tick * 100 % Math.floor((scene.tps / this.tps) * 100) == 0) {
            this.callback();
        }
    }
}


function filterIns(insNames:string[]):any[] {
    let result:any[] = [];
    for(let i = 0; i<insNames.length; i++) {
        result.concat(ins[insNames[i]]);
    }
    return result;
}

module.exports = {
    Actor:Actor,
    Instance:Instance,
    def:def,
    Loop:Loop,
    filterIns:filterIns
}

