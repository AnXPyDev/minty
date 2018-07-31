const s_main = new Scene("s_main", v(800,600), {
    main:[[]],
    cursor:[[]]
},{
    main:[["noimage"], "solid", "black"]
},{
    
},() => {
    vport.resize(v(600,600));    
},() => {}, 60,60);

GAME.onload = function() {
    s_main.load();
}

const polygon = new Polygon();

function exportPolygon(name) {
    let exports = {root:[]};
    polygon.val.forEach(element => {
        exports.root.push([element.x, element.y]);
    });
    exportObjectAsJson(exports, name);
}

function update() {
    for(let i = 0; i < ins.point.length; i++) {
        Instance.destroy("point", i);
    }
    polygon.grabinfo();
    for(let e = 0; e < polygon.val.length; e++) {
        Instance.spawn("point", [e]);
    }
}

def("main", class extends Actor {
    constructor() {
        super(v(), "main");
        this.mdepth = 20;
    }
    tick() {
        when(Key.check("control") && Key.check("z"), () => {
            polygon.val.splice(-1,1);
            update();
        });
    }
    mousedown() {
        polygon.val.push(v(Mouse.x, Mouse.y));
        update();
    }
    draw() {
        polygon.draw();
    }

})

def("point", class extends Actor {
    constructor(e) {
        super(polygon.val[e], "point");
        this.size = v(8,8);
        this.pnt = e;
        this.depth = 200;
        this.clicked = false;
        this.counter = 0;
        this.counterlen = 60 / 5;
    }
    tick() {
        if(this.clicked) {
            if(!Key.check("mouse")) {
                this.clicked = false;
            } else {
                this.pos.x = Mouse.x;
                this.pos.y = Mouse.y;
            }
        }
        this.counter = clamp(this.counter - 1, 0, this.counterlen);
    }
    mousedown() {
        if(collides(this, ["cursor"]).is) {
            this.clicked = true;
            if(Key.check("control")) {
                polygon.val.splice(this.pnt, 1);
                update();
                console.log("removed");
            }
            this.counter = this.counterlen;
            return true;
        }
    }
    draw() {
        Draw.ellipse(this.size, this.pos, "lime");
    }
})

def("cursor", class extends Actor {
    constructor() {
        super(Mouse, "cursor");
        this.depth = 1000;
    }
    draw() {
        Draw.line(v(-vport.size.x + Mouse.x, Mouse.y),v(vport.size.x + Mouse.x, Mouse.y), "white", 2);
        Draw.line(v(Mouse.x, -vport.size.y + Mouse.y),v(Mouse.x, vport.size.y + Mouse.y), "white", 2);
        Draw.text(`${Mouse.x}, ${Mouse.y}`, v(Mouse.x + 64, Mouse.y + 40), "white", 16);  
    }
})


