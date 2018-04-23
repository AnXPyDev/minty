const r0 = new Scene(
    {
        main: [[]]
    },
    {
        main: ["bck", "tiled"]
    },
    () => {
        bck.main.spd = v(5,5);
        bck.main.scale = v(2,2);
    },
    () => {},
    60
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
        this.poly = new Polygon();
        this.poly.set([[0,0],[40,0],[40,40],[0,40]]);
        this.poly.center();
        this.poly1 = new Polygon();
        this.poly1.set([[0,0],[40,40],[0,40]]);
        this.poly1.scale(v(4,4));
        this.poly1.center(v(300,300));
    }
    tick() {
        this.x = Mouse.x;
        this.y = Mouse.y;
        this.sprite.update();
        this.poly.center(Mouse);
        console.log(this.poly.collides(this.poly1));
    }
    draw() {
        this.sprite.draw(new Vector(this.x, this.y), new Vector(20,30));
        this.poly1.draw();
        this.poly.draw();
    }
})

