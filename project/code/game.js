const r0 = new Scene(
    {
        main: [[]]
    },
    {
    },
    () => {},
    () => {},

)

GAME.onload = function() {
    r0.load();
}

def("main", class extends Actor {
    constructor() {
        super();
        this.x = 50;
        this.y = 50;
        this.spd = 5;
        this.tickrate = 1;
        this.sprite = new Sprite("cursor");
    }
    tick() {
        this.x = lerp(this.x,Mouse.x,0.5,true);
        this.y = lerp(this.y,Mouse.y,0.5,true);
    }
    draw() {
        this.sprite.draw(new Vector(this.x, this.y), new Vector(20,30));
    }
    mousedown() {
        console.log("xd");
    }
})