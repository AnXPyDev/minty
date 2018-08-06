class Scene {
    public onload:(...args:any[]) => void;
    public onbeforeload:() => void;
    public index:number;
    public act:any;
    public til:any;
    public bck:any;
    public tps:number;
    public next:Scene | null;
    public size:Vector;
    public aps:number;
    public ignore_persistant:boolean;
    public name:string;
    public vars:any;

    constructor(name:string, size:Vector, act:any, bck:any,til:any, onload:(...args:any[]) => void, onbeforeload:() => void, tps:number = 60, aps:number = tps) {
        this.index = 0;
        this.onload = onload;
        this.onbeforeload = onbeforeload;
        this.act = act;
        this.bck = bck;
        this.til = til;
        this.tps = tps;
        this.next = null;
        this.size = size;
        this.aps = aps;
        this.ignore_persistant = false;
        this.name = name;
        this.vars = {};
    } 

    load(...args:any[]):void {
        this.onbeforeload();
        pause();
        scene = this;
        let insKeys:string[] = Object.keys(ins);
        for(let i = 0; i < insKeys.length; i++) {
            for(let e = 0; e < ins[insKeys[i]].length; e++) {
                if (!(ins[insKeys[i]][e] == null) && (!(ins[insKeys[i]][e].isPersistant) || ((this.ignore_persistant)))) {
                    //@ts-ignore
                    Instance.destroy(insKeys[i], e);
                }
            }
        }
        let actKeys:string[] = Object.keys(this.act);
        for(let i = 0; i < actKeys.length; i++) {
            for(let e = 0; e < this.act[actKeys[i]].length; e++) {
                Instance.spawn(actKeys[i], this.act[actKeys[i]][e]);
            }
        }
        bck = {};
        let bckKeys:string[] = Object.keys(this.bck);
        for(let i = 0; i < bckKeys.length; i++) {

            let pho:any[] = this.bck[bckKeys[i]];
            //@ts-ignore
            bck[bckKeys[i]] = new Background(...pho);
        }
        tileins = {};
        let tilKeys:string[] = Object.keys(this.til);
        for(let i = 0; i < tilKeys.length; i++) {
            let split = tilKeys[i].split(".");
            if(this.til[tilKeys[i]]) {
                if(!tileins[split[0]]) {
                    tileins[split[0]] = {};
                }
                if(!tileins[split[0]][split[1]]) {
                    tileins[split[0]][split[1]] = [];
                }
                for(let e = 0; e<this.til[tilKeys[i]].length; e++) {
                    tileins[split[0]][split[1]].push([v(this.til[tilKeys[i]][e][0], this.til[tilKeys[i]][e][1]), v(this.til[tilKeys[i]][e][2],this.til[tilKeys[i]][e][3])]);
                }
            }
        }
        this.onload(...args);
        tick = 0;
        resume(this.tps, this.aps);
        
    }

    setNext(scene:Scene):void {
        this.next = scene;
    }
    loadnext() {
        //@ts-ignore
        this.next.load();
    }
}



module.exports = {
    Scene:Scene
}