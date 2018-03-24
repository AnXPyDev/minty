// name: "math"
// desc: "..."
// exports: Vector 


class Vector {
    public x:number;
    public y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
}

module.exports = {
    Vector:Vector
}