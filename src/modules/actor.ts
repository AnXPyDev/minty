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

module.exports = {
    Actor:Actor
}