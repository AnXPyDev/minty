class Scene {
    public onload:() => void;
    public onbeforeload:() => void;
    public index:number;
    public act:any;
    public bck:any;
    public tps:number;
    public next:Scene | null;

    constructor(act:any, bck:any, onload:() => void, onbeforeload:() => void, tps:number = 60) {
        this.index = 0;
        this.onload = onload;
        this.onbeforeload = onbeforeload;
        this.act = act;
        this.bck = bck;
        this.tps = tps;
        this.next = null;
    } 

    load():void {
        this.onbeforeload();
        scene = this;
        let insKeys:string[] = Object.keys(ins);
        for(let i in ins) {
            for(let e in ins[i]) {
                if (!ins[i][e].persistant) {
                    //@ts-ignore
                    Instance.destroy(insKeys[i], e);
                }
            }
        }

        let actKeys:string[] = Object.keys(this.act);
        for(let i in actKeys) {
            for(let e in this.act[actKeys[i]]) {
                Instance.spawn(actKeys[i], this.act[actKeys[i]][e]);
            }
        }
        bck = {};
        let bckKeys:string[] = Object.keys(this.bck);
        for(let i in bckKeys) {

            let pho:any[] = this.bck[bckKeys[i]];
            //@ts-ignore
            bck[bckKeys[i]] = new Background(...pho);
        }
        this.onload();
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