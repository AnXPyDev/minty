class Actor {
    public x:number;
    public y:number;


    constructor() {
        this.x = 0;
        this.y = 0;
    }
    step():void {}
    draw():void {}
}

function def(...names:string[]):void {
    names.forEach((name:string) => {
        act[name] = [];
    })
}

module.exports = {
    Actor:Actor,
    def:def
}

