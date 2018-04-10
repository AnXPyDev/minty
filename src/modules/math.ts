// name: "math"
// desc: "..."
// exports: Vector 


class Vector {
    public x:number;
    public y:number;

    constructor(x:number = 0, y:number = 0) {
        this.x = x;
        this.y = y;
    }
}

module.exports = {
    Vector:Vector
}