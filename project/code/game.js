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
        this.sprite = new Sprite("cursor", 2, 10);
    }
    tick() {
        this.x = Mouse.x;
        this.y = Mouse.y;
        this.sprite.update();
    }
    draw() {
        this.sprite.draw(new Vector(this.x, this.y), new Vector(20,30));
    }
})