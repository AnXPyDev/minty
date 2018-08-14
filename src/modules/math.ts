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

    rotate(angle:Angle):Vector {
        let sin:number = Math.sin(angle.rad);
        let cos:number = Math.cos(angle.rad);
        let x = this.x - this.origin.x;
        let y = this.y - this.origin.y;
        this.x = (x * cos - y * sin) + this.origin.x;
        this.y = (x * sin + y * cos) + this.origin.y;
        return this;
    }   

    setorigin(v:Vector):Vector {
        this.origin.x = v.x;
        this.origin.y = v.y;
        return this;
    }
    
    toOrigin(v:Vector):Vector {
        this.x = this.x - this.origin.x + v.x;
        this.y = this.y - this.origin.y + v.y;
        this.origin.x = v.x;
        this.origin.y = v.y;
        return this;
    }
    copy(v:Vector):Vector {
        this.x = v.x;
        this.y = v.y;
        this.origin = v.origin;
        return this;
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
                return value / 180 * Math.PI;
            }
            return value;
        }(this.default);
    }

    set(value:number, type:string = this.default):Angle {
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
        return this;
    }

    to(value:number, type:string):number {
        if (type == "rad") {
            return value * 180 / Math.PI;
        } else if (type == "deg") {
            return value * Math.PI / 180;
        }
        return value;
    }

    get(type:string = this.default):number {
        if (type == "rad") {
            return this.rad;
        } else if (type == "deg") {
            return this.deg;
        }
        return 1;
    }

    dir():Vector {
        return new Vector(
            Math.cos(this.rad),
            Math.sin(this.rad)
        )
    }

    between(v1:Vector, v2:Vector):Angle {
        this.set(Math.PI + Math.atan2(v1.y - v2.y, v1.x - v2.x), "rad");
        return this;
    }
    
    interpolate(angle:Angle, amt:number):Angle {
        let ang = [Math.max(this.deg, angle.deg), Math.min(this.deg, angle.deg)];
        let alpha = 360 - ang[0] + ang[1];
        let beta = ang[0] - ang[1];
        if (alpha < beta) {
            if (this.deg < 180) {
                this.set(wrap(lerp(this.deg, this.deg - alpha, amt), 0, 360), "deg");
            } else {
                this.set(wrap(lerp(this.deg, this.deg + alpha, amt), 0, 360), "deg");
            }
        } else {
            this.set(lerp(this.deg, angle.deg, amt), "deg");
        }
        return this;
    }

    approach(angle:Angle, amt:number):Angle {
        let ang = [Math.max(this.deg, angle.deg), Math.min(this.deg, angle.deg)];
        let alpha = 360 - ang[0] + ang[1];
        let beta = ang[0] - ang[1];
        if (alpha < beta) {
            if (this.deg < 180) {
                this.set(wrap(approach(this.deg, this.deg - alpha, amt), 0, 360), "deg");
            } else {
                this.set(wrap(approach(this.deg, this.deg + alpha, amt), 0, 360), "deg");
            }
        } else {
            this.set(approach(this.deg, angle.deg, amt), "deg");
        }
        return this;
    }
}

class Polygon {
    public val:Vector[];
    public root:number[][];
    public offset:Vector;
    public corner:{min:Vector, max:Vector};
    public isRect:boolean;

    constructor(type:string = "") {
        this.val = [];
        this.offset = v();
        this.corner = {min:v(), max:v()};
        this.root = [];
        this.isRect = type == "rect";
    }

    set(polygon:number[][]):Polygon {
        let temp:Vector[] = [];
        for(let i = 0; i<polygon.length; i++) {
            temp.push(new Vector(...polygon[i]));
        }
        this.val = temp;
        this.root = polygon;
        this.grabinfo();
        this.center();
        return this;
    }
    
    edit(callback:(vec:Vector) => Vector):Polygon {
        let temp = this.val;
        for(let i = 0; i<temp.length; i++) {
            temp[i] = callback(temp[i]);
        }
        this.val = temp;
        return this;
    }

    center(origin:Vector = new Vector()):Polygon {
        this.edit(vec => {
            let pho = v(
                vec.x - this.offset.x + origin.x,
                vec.y - this.offset.y + origin.y
            )
            pho.setorigin(this.offset);
            return pho;
        })
        this.grabinfo();
        return this;
    }

    rotate(angle:Angle):Polygon {
        this.edit(vec => {
            let pho = vec;
            pho.setorigin(this.offset);
            pho.rotate(angle);
            return pho;
        })
        this.grabinfo();
        this.isRect = angle.deg == 0 ? true:false;
        return this;
    }

    size(size:Vector):Polygon {
        let sz:Vector = v(
            this.corner.max.x - this.corner.min.x,
            this.corner.max.y - this.corner.min.y
        );
        this.scale(v(
            size.x / sz.x,
            size.y / sz.y
        ))
        this.grabinfo();
        return this;
    }

    scale(scale:Vector):Polygon {
        this.center();
        this.edit(vec => {
            return v(vec.x * scale.x, vec.y * scale.y);
        })
        this.center(this.offset);
        this.grabinfo();
        return this;
    }

    collides(poly:Polygon):boolean {
        let isUndefined = (x:any) => x == null;
        let a:Vector[] = this.val;
        let b:Vector[] = poly.val;
        var polygons = [this.val, poly.val];
        var minA, maxA, projected, i, i1, j, minB, maxB;
        for (i = 0; i < polygons.length; i++) {
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
                minA = maxA = undefined;
                //@ts-ignore
                for (j = 0; j < a.length; j++) {
                    //@ts-ignore
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    //@ts-ignore
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    //@ts-ignore
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }
                minB = maxB = undefined;
                //@ts-ignore
                for (j = 0; j < b.length; j++) {
                    //@ts-ignore
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    //@ts-ignore
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    //@ts-ignore
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }
                //@ts-ignore
                if (maxA <= minB || maxB <= minA) {
                    return false;
                }
            }
        }
        return true;
    }

    collidesRect(poly:Polygon):boolean {
        // no horizontal overlap
        if (this.corner.min.x >= poly.corner.max.x || poly.corner.min.x >=this.corner.max.x) return false;
    
        // no vertical overlap
        if (this.corner.min.y >= poly.corner.max.y || poly.corner.min.y >= this.corner.max.y) return false;
    
        return true;
    }

    grabinfo():Polygon {
        (() => {
            let x:number[] = [];
            let y:number[] = [];
            for(let i = 0; i<this.val.length; i++) {
                x.push(this.val[i].x);
                y.push(this.val[i].y);
            }
            let min:Vector = v(Math.min(...x), Math.min(...y));
            let max:Vector = v(Math.max(...x), Math.max(...y));
            this.corner.min = min;
            this.corner.max = max;
            this.offset = v(
                min.x + (max.x - min.x) / 2,
                min.y + (max.y - min.y) / 2
            )
            this.edit(vec => {
                let pho = vec;
                pho.setorigin(this.offset);
                return pho;
            })
        })();
        return this;
    }

    draw(fill:string = "lightblue", stroke:string = "blue") {
        if(this.val.length > 0) {
            ctx.save();
            ctx.beginPath()
            ctx.moveTo(this.val[0]);
            for(let i = 1; i < this.val.length; i++) {
                ctx.lineTo(this.val[i]);
            }
            ctx.closePath();
            ctx.setStrokeStyle(stroke);
            ctx.setFillStyle(fill);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

}

function MorphPolygon(poly:Polygon, that:Actor, pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle):Polygon{
    let p = new Polygon();
    p.set(poly.root);
    p.grabinfo();
    p.size(size);
    p.center(pos);
    p.rotate(angle);
    return p;
} 

const Random:{
    int:(min:number, max:number) => number,
    float:(min:number, max:number) => number,
    choose:(args:any[]) => any,
    rgb:() => string,
    rgba:() => string,
    sign:() => number
} = {
    int(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1) + min); 
    },
    float(min:number, max:number) {
        return Math.random() * (max - min) + min;
    },
    choose(args:any[]):any {
        return args[Math.floor(Math.random() * args.length)];
    },
    rgb():string {
        return "rgb(" + Random.int(0,255) + "," + Random.int(0,255) + "," + Random.int(0,255) + ")";
    },
    rgba():string {
        return "rgba(" + Random.int(0,255) + "," + Random.int(0,255) + "," + Random.int(0,255) + "," + Math.random() + ")";
    },
    sign():number {
        if(chance(50)) {
            return 1;
        }
        return -1;
    }
}

const rectRoot = [[-1,-1],[1,-1],[1,1],[-1,1]];

function v(x:number = 0, y:number = x):Vector {
    return new Vector(x,y);
}

function a(value:number = 0, defaultType:string = "deg"):Angle {
    return new Angle(defaultType, value);
}

function p(root:number[][] = rectRoot, type:string | undefined = root.length == 4 ? "rect":undefined):Polygon {
    let p = new Polygon(type);
    return p.set(root);
}

function distanceBetween(v0:Vector,v1:Vector) {
    return (Math.sqrt(Math.pow(Math.abs(v0.x - v1.x),2) + Math.pow(Math.abs(v0.y - v1.y),2)));
}
module.exports = {
    Vector:Vector,
    Angle:Angle,
    Polygon:Polygon,
    MorphPolygon:MorphPolygon,
    Random:Random,
    rectRoot,
    v:v,
    a:a,
    p:p,
    distanceBetween:distanceBetween
}

