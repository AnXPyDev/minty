<h1>minty</h1>


# _Requirements_:

    Node.js + npm (newest version recommended)
  
    Git + Git Bash

# _Installation guide_:
    
  Create a folder and open **_git bash_** in it, then run these commands

    $ git clone https://github.com/AnXPyDev/minty.git
  
    $ cd ./minty
    
    $ npm install 
    
    $ bash compile.sh (you may insert the name of a project here)
  
    $ bash run.sh
    
# _Examples_: 

    https://github.com/AnXPyDev/minty-projects

# _Packaging the app_:


    $ bash build.sh (insert name of project here)
    
  You will find the packaged project in the "built" folder inside the folder that contains minty

# _Using minty_:

  Creating a simple pong game.
```javascript
// Initialize a Scene
const s0 = new Scene("s0", v(640, 640), 
{
    // Spawn objects
    paddle:[[]],
    paddle_ai:[[]],
    ball:[[]]
},
{
    // Spawn background
    main:["noimage", "solid", "black"]
},() => {
    // Resize viewport to custom size
    vport.resize(v(640,640));
},() => {}, 60, 60)

GAME.onload = function() {
    // Load scene when game is ready to be loaded
    s0.load();
}

// Define an actor 
def("paddle", class extends Actor {
    constructor() {
        super(v(-280), "paddle");
        this.speed = 8;
        this.size = v(8,64);
    }
    tick() {
        this.pos.y = lerp(this.pos.y, Mouse.y, 0.1);
    }
    draw() {
        Draw.rect(this.size, this.pos, "white");
    }
}, ["paddle"]);

def("paddle_ai", class extends act.paddle {
    constructor() {
        super();
        this.name = "paddle_ai";
        this.pos.x = 280;
    }
    tick() {
        this.pos.y = clamp(approach(this.pos.y, Instance.get("ball", 0).pos.y, this.speed), -320, 320);
    }
}, ["paddle"]);

def("ball", class extends Actor {
    constructor() {
        super(v(), "ball");
        this.dir = v(Random.int(4,8),Random.int(4,8));
        this.size = v(8,8);
    }
    tick() {
        // Invert direction when hitting paddle
        if(collides(this, Instance.filter(["paddle"])).is) {
            this.dir.x *= -1;
        }
        // Check for hitting ceiling or fllor
        if (this.pos.y < -320 || this.pos.y > 320) {
            this.dir.y *= -1;
        }
        // Check for going behind a paddle
        if(this.pos.x < -320 || this.pos.x > 320) {
            s0.load();
        }
        this.pos.x += this.dir.x;
        this.pos.y += this.dir.y;
    }
    draw() {
        Draw.ellipse(this.size, this.pos, "white");
    }
});
```