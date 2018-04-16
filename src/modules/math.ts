// name: "math"
// desc: "..."
// exports: Vector 


class Vector {
    public x:number;
    public y:number;
    public origin:{x:number,y:number};

    constructor(x:number = 0, y:number = 0, original:boolean = true) {
        this.x = x;
        this.y = y;
        this.origin = {x:0,y:0};
    }

    rotate(angle:Angle) {
        let sin:number = Math.sin(angle.rad);
        let cos:number = Math.cos(angle.rad);
        this.x = ((this.x - this.origin.x) * cos - (this.y - this.origin.y) * sin) + this.origin.x;
        this.x = ((this.x - this.origin.x) * sin + (this.y - this.origin.y) * cos) + this.origin.x;
    }   

    setorigin(v:Vector) {
        this.origin.x = v.x;
        this.origin.y = v.y;
    }
}

class Angle {
    public rad:number;
    public deg:number;
    private default:string;
    private types:string[];

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
        this.deg = function(type:string):number {
            if (type == "rad") {
                return value  * 180 / Math.PI;
            }
            return value;
        }(type);
        this.rad = function(type:string):number {
            if (type == "deg") {
                return value * Math.PI / 180;
            }
            return value;
        }(type);
    }

    to(value:number, type:string):number {
        if (type == "rad") {
            return value * 180 / Math.PI;
        } else if (type == "deg") {
            return value * Math.PI / 180;
        }
        return value;
    }

    get():number {
        if (this.default == "rad") {
            return this.rad;
        } else if (this.default == "deg") {
            return this.deg;
        }
        return 1;
    }

    dir():Vector {
        return new Vector(
            Math.cos(this.rad) * -1,
            Math.sin(this.rad) * -1
        )
    }

    between(v1:Vector, v2:Vector):void {
        this.set(Math.atan2(v1.y - v2.y, v1.x - v2.x), "rad");
    }
}

class Polygon {
    public val:Vector[]
    constructor(type:string = "rect") {
        this.val = [];

    }
}

module.exports = {
    Vector:Vector,
    Angle:Angle
}