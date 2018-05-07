const r0 = new Scene(
    v(1024,576),
    {
        main: [[]],
        spawner: [[]]
    },
    {
        //main: ["bck", "tiled"]
    },
    () => {
        //bck.main.spd = v(0,5);
        //bck.main.scale = v(2,2);
        camera = new Camera();
        vport.resize(v(1024,576));
    },
    () => {},
    60
)

GAME.onload = function() {
    r0.load();
}

function prect(sz) {
    let p = new Polygon();
    p.set([[0,0],[sz.x,0],[sz.x,sz.y],[0,sz.y]]);
    p.center(v());
    return p;
}

def("main", class extends Actor {
    constructor() {
        super();
        this.pos.y = Math.floor(scene.size.y * 0.8);
        this.pos.x = Math.floor(scene.size.x * 0.5);
        this.mask = prect(v(40,40));
        this.size = v(30,40);
        this.depth = 15;
    }
    tick() {
        this.pos.x = lerp(this.pos.x, Mouse.x, 0.5, true);
    }
    draw() {
        let p = MorphPolygon(this.mask, this);
        p.draw((collides(this, "enemy").is ? "red" : "green"));
    }
    
}) 

def("spawner", class extends Actor {
    constructor() {
        super();
        this.loop("spn", () => {Instance.spawn("enemy", [])}, 5);
    }
}) 

def("enemy", class extends Actor {
    constructor() {
        super();
        this.pos.x =  Math.floor(Math.random() * scene.size.x);
        this.pos.y = -60;
        this.size = v(Math.floor(Math.random() * 5 + 20),Math.floor(Math.random() * 40 + 40));
        this.spd = Math.floor(Math.random() * 10 + 5); 
        this.mask = prect(v(40,40));
    }
    tick() {
        this.pos.y += this.spd;
        if(this.pos.y > scene.size.y + this.size.y / 2) {
            Instance.destroy("enemy", this.id);
        }
        this.angle.set(this.angle.deg + this.spd/4, "deg");
    }
    draw() {
        MorphPolygon(this.mask, this).draw();
    }
})