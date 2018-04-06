class Scene {
    public onload:() => void;
    public onbeforeload:() => void;
    public index:number;
    public act:any;
    public bck:any;

    constructor(act:any, bck:any, onload:() => void, onbeforeload:() => void) {
        this.index = 0;
        this.onload = onload;
        this.onbeforeload = onbeforeload;
        this.act = act;
        this.bck = bck;
    } 

    load():void {
        this.onbeforeload();
        for(let i in ins) {
            for(let e in ins[i]) {
                if (!ins[i][e].persistant) {
                    ins[i][e].destroy();
                }
            }
        }

        let actKeys:string[] = Object.keys(this.act);
        for(let i in actKeys) {
            for(let e in ins[i]) {
                Instance.spawn(actKeys[i], ins[i][e]);
            }
        }

        bck = {};
        let bckKeys:string[] = Object.keys(this.bck);
        for(let i in bckKeys) {
            
        }
    }

    setNext():void {
        
    }
}



module.exports = {

}