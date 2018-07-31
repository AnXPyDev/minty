const s0 = new Scene("s0", v(1024,1024), 
{
    main_logic:[[]],
    cursor:[[]]
},
{
    grid:[["grid"], "tiled"]
},
{
}, () => {
    vport.resize(v(800,600));
    bck.grid.setOffset(v(16,16));
}, () => {

}, 60,60)

GAME.onload = function() {
    s0.load();
}

const exports = {};
const info = {
    name: "none",
    size: v(32,32)
}
const colors = {};
colors.none = Random.rgb();
let gridsize = v(32,32);

let steps = [];

let selection = [];
let isSelected = false;
let selectSmaller = v(0,0);
let sceneSize = v(600,600);

function setInfo(name, size, gs = size) {
    info.name = name;
    info.size = size;
    
    if(!colors[name]) {
        colors[name] = `rgb(${Random.int(155,255)},${Random.int(155,255)},${Random.int(155,255)})`;
    }

    bck.grid.setScale(v(gs.x / 32, gs.y / 32)); 
    gridsize = gs;
}

function setSceneSize(size) {
    sceneSize = size;
}

function gridPos(pos) {
    return v(Math.floor((pos.x - gridsize.x / 2) / gridsize.x + 1), Math.floor((pos.y - gridsize.y / 2 + 1) / gridsize.y + 1));
}

function exportScene(name) {
    ins.block.forEach(x => {
        x.export();
    })
    exportObjectAsJson(exports, name);
}

def("main_logic", class extends Actor {
    constructor() {
        super(v(), "main_logic");
        this.isCollidable = false;
        this.depth = 10;
    }
    tick() {
        camera.pos.x += (-Key.check("arrowleft") + Key.check("arrowright")) * 8;
        camera.pos.y += (-Key.check("arrowup") + Key.check("arrowdown")) * 8;
        when(Key.check("control") && Key.check("z"), () => {
            if(steps[steps.length - 1]) {
                steps[steps.length - 1].forEach(x => {
                    Instance.destroy("block", x);
                })
                steps.splice(-1, 1);

            }
        })
        when(Key.check("control") && Key.check("c"), () => {
            camera.pos.x = 0;
            camera.pos.y = 0;
        })
        when(Key.check("mouse"), () => {
            if(Key.check("control") && Key.check("s")) {
                isSelected = true;
                selection[0] = selection[1] = gridPos(Mouse);
            } else if(Key.check("control") && Key.check("a")){
                let gp = gridPos(Mouse);
                steps.push([this.placeCollision(v(gridsize.x * gp.x, gridsize.y * gp.y), info.size)]);
            } else {
                steps.push([this.place(gridPos(Mouse))]);
            }
        })
        if(isSelected) {
            selection[1] = gridPos(Mouse);
            if(selection[1].x < selection[0].x) {
                selectSmaller.x = 1;
            } else {
                selectSmaller.x = 0;
            }
            if(selection[1].y < selection[0].y) {
                selectSmaller.y = 1;
            } else {
                selectSmaller.y = 0;
            }
        }
        when(!Key.check("mouse") && isSelected, () => {
            isSelected = false;
            steps.push([]);       
            if(Key.check("control") && Key.check("a")) {
                let r = pos_to_sz(
                    v(selection[selectSmaller.x].x * gridsize.x - gridsize.x / 2, selection[selectSmaller.y].y * gridsize.y - gridsize.y / 2),
                    v(selection[flip(selectSmaller.x, 0, 1)].x * gridsize.x + gridsize.x / 2, selection[flip(selectSmaller.y, 0, 1)].y * gridsize.y + gridsize.y / 2)
                )
                steps[steps.length - 1].push(this.placeCollision(r.pos,r.size));
            } else {  
                for(let x = selection[selectSmaller.x].x; x < selection[flip(selectSmaller.x, 0, 1)].x + 1; x++) {
                    for(let y = selection[selectSmaller.y].y; y < selection[flip(selectSmaller.y, 0, 1)].y + 1; y++) {
                        steps[steps.length - 1].push(this.place(v(x,y)));
                    }
                }
            }
        })
    }
    draw() {
        Draw.rectS(sceneSize, v(), "red", 4);
        Draw.line(v(-vport.size.x / 2 + camera.pos.x, 0), v(vport.size.x / 2 + camera.pos.x, 0),"lime", 4);
        Draw.line(v(0, -vport.size.y / 2 + camera.pos.y), v(0, vport.size.y / 2 + camera.pos.y),"lime", 4);
        if(isSelected) {
            let r = pos_to_sz(
                v(selection[selectSmaller.x].x * gridsize.x - gridsize.x / 2, selection[selectSmaller.y].y * gridsize.y - gridsize.y / 2),
                v(selection[flip(selectSmaller.x, 0, 1)].x * gridsize.x + gridsize.x / 2, selection[flip(selectSmaller.y, 0, 1)].y * gridsize.y + gridsize.y / 2)
            )
            Draw.opacity(wave(0,1,1.75), () => {
                Draw.rectS(r.size, r.pos, "white", 4);
            });   
        }
    }
    place(gp) {
        return Instance.spawn("block", [v(gp.x * gridsize.x, gp.y * gridsize.y), info.size]);
    }
    placeCollision(pos, size) {
        return Instance.spawn("block", [pos, size, true])
    }
});

def("block", class extends Actor {
    constructor(pos, size, collision = false) {
        super(pos, "block");
        this.size = size;
        this.NAME = info.name;
        this.collision = collision;
        this.isCollidable = false;
        this.alpha = 0;
    }
    tick() {
        this.alpha = clamp(this.alpha + 0.05,0,1);
    }
    draw() {
        Draw.opacity(this.alpha, () => {
            if(!this.collision) {
                Draw.rectS(this.size, this.pos, colors[this.NAME], gridsize.x / 4);
            } else {
                Draw.opacity(0.75,() => {
                    Draw.rect(this.size, this.pos, "violet");
                })
            }

        })
    }
    export() {
        if(!this.collision) {
            if(!this.NAME.includes(".")) {
                exports[this.NAME] ? exports[this.NAME].push([this.pos.x, this.pos.y]) : exports[this.NAME] = [[this.pos.x, this.pos.y]];
            } else {
                exports[this.NAME] ? exports[this.NAME].push([this.pos.x, this.pos.y, this.size.x, this.size.y]) : exports[this.NAME] = [[this.pos.x, this.pos.y, this.size.x, this.size.y]];
            }
        } else {
            exports["collisionblock"] ? exports["collisionblock"].push([this.pos.x, this.pos.y, this.size.x, this.size.y]) : exports["collisionblock"] = [[this.pos.x, this.pos.y, this.size.x, this.size.y]];
        }
        console.log("exported", exports);
    }
})

def("cursor", class extends Actor {
    constructor() {
        super(Mouse, "cursor");
        this.depth = 1000;
        this.size = v(8,8);
    }
    draw() {
        Draw.line(v(-vport.size.x + Mouse.x, Mouse.y),v(vport.size.x + Mouse.x, Mouse.y), "white", 2);
        Draw.line(v(Mouse.x, -vport.size.y + Mouse.y),v(Mouse.x, vport.size.y + Mouse.y), "white", 2);
        Draw.text(`${Mouse.x}, ${Mouse.y}`, v(Mouse.x + 64, Mouse.y + 40), "white", 16);
        Draw.text(`${Math.floor((Mouse.x - gridsize.x / 2) / gridsize.x + 1)}, ${Math.floor((Mouse.y - gridsize.y / 2) / gridsize.y + 1) }`, v(Mouse.x + 64, Mouse.y + 80), "white", 16);
    }
})
