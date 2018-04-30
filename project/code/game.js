const r0 = new Scene(
    v(600,600),
    {
        main: [[]]
    },
    {
        //main: ["bck", "tiled"]
    },
    () => {
        //bck.main.spd = v(0,5);
        //bck.main.scale = v(2,2);
        camera = new Camera();
        vport.resize(v(600,600));
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
        this.y = Math.floor(scene.size.y * 0.8);
        this.x = Math.floor(scene.size.x * 0.5);
        this.mask = prect(v(20,40));
        this.size = v(20,40);
    }
    draw() {
        let m = this.mask;
        m.size(this.size);
        m.center(this.pos);
        m.rotate(this.angle);
        m.draw(this);
    }
    
}) 
