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
        this.x = 0;
        this.y = 0;
        this.spd = 5;
        this.tickrate = 1;
    }
    tick() {
        this.x = Mouse.x;
        this.y = Mouse.y;
    }
    draw() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
    }
})