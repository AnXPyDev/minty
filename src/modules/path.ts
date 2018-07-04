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

    constructor(client:Vector) {
        this.progress = 0;
        this.stepIndex = -1;
    }
}