class Path {
    public vectors:Vector[];
    public steps:PathStep[];
    public clients:PathClient[];

    constructor(vectors:Vector[]) {
        this.vectors = vectors;
        this.steps = [];
        this.clients = [];
        for(let i = 0; i < this.vectors.length - 1; i++) {
            this.steps.push(new PathStep([this.vectors[i], this.vectors[i+1]]));
        }
        this.steps.push(new PathStep([this.vectors[this.vectors.length - 1], this.vectors[0]]));
    }
    addClient(x:Vector):PathClient {
        this.clients.push(new PathClient(this.steps, x));
        return this.clients[this.clients.length - 1];
    }
}

class PathStep {
    public vectors:Vector[];
    public length:number;
    public angle:Angle;

    constructor(vectors:Vector[]) {
        this.vectors = vectors;
        this.length = distanceBetween(this.vectors[0], this.vectors[1]);
        this.angle = new Angle("deg", 0);
        this.angle.between(this.vectors[0], this.vectors[1]);    
    }
}

class PathClient {
    public progress:number;
    public stepIndex:number;
    public client:Vector;
    public speed:number;
    public steps:PathStep[];
    public paused:boolean;

    constructor(steps:PathStep[], client:Vector) {
        this.progress = 0;
        this.stepIndex = -1;
        this.client = client;
        this.speed = 0;
        this.steps = steps;
        this.steps[-1] = new PathStep([v(this.client.x, this.client.y), this.steps[0].vectors[0]]);
        this.paused = false;
        loop.push(new Loop(() => {this.update()}, 1));
    }
    doStep() {
        let dirMult = this.steps[this.stepIndex].angle.dir();
        if(this.progress + this.speed < this.steps[this.stepIndex].length) {
            this.progress += this.speed;
            this.client.x += this.speed * dirMult.x;
            this.client.y += this.speed * dirMult.y;
        } else {
            this.progress = 0;
            this.client.x = this.steps[this.stepIndex].vectors[1].x;
            this.client.y = this.steps[this.stepIndex].vectors[1].y;
            this.stepIndex = wrap_np(this.stepIndex + 1, 0, this.steps.length - 1);
        }
    }
    update() {
        if(!this.paused) {
            this.doStep();
        }
    }
}

module.exports = {
    Path:Path,
    PathClient:PathClient,
    PathStep:PathStep
}