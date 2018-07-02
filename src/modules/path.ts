class Path {
    public points:Vector[];
    public steps:number;
    public clients:PathClient[];
    public stepsInfo:{length:number}[];
    constructor(points:Vector[]) {
        this.points = points;
        this.clients = [];
        this.steps = this.points.length;
        this.stepsInfo = [];
        for(let x = 1; x <this.points.length; x++) {
            this.stepsInfo.push({length:distanceBetween(this.points[x-1], this.points[x])});
        }
        this.stepsInfo.push({length:distanceBetween(this.points[this.points.length - 1], this.points[0])});
    }
    getStep(index:number):Vector[] {
        return [this.points[index - 1], this.points[index == this.steps ? 0 : index]]
    }
    assignClient(x:Vector):PathClient {
        this.clients.push(new PathClient(this.clients.length,x,this));
        return this.clients[this.clients.length - 1];
    } 
}

class PathClient {
    public step:number;
    public id:number;
    public point:Vector;
    public parent:Path;
    public speed:number;
    constructor(id:number,point:Vector,parent:Path) {
        this.step = 0;
        this.id = id;
        this.point = point;
        this.parent = parent;
        this.speed = 0;
    }
}
