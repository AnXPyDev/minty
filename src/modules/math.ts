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

class Angle {
    public rad:number;
    public deg:number;
    private default:string;
    private types:string[];

    public to(value:number, type:string) {}

    constructor(defaulttype:string = "rad", value:number) {
        this.types = ["deg", "rad"];
        this.default = "rad";
        if (defaulttype == this.types[0] || defaulttype == this.types[1]) {
            this.default = defaulttype;
        }
        this.deg = function(type:string):number {
            if (type == "rad") {
                return value  * 180 / Math.PI;
            }
            return value;
        }(this.default);
        this.rad = function(type:string):number {
            if (type == "deg") {
                return value * Math.PI / 180;
            }
            return value;
        }(this.default);
    }

    set(value:number, type:string = this.default) {

    }
}

module.exports = {
    Vector:Vector
}