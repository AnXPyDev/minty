class SR3D_camera {
    zoom:number
    pos:Vec3

    constructor(pos:Vec3 = new Vec3()) {
        this.zoom = 1;
        this.pos = pos;
    }

    perspective(point:Vec3):Vector {
        let mult = point.z * this.zoom
        let vec:Vector = v();
        return v();
    }
}

class Vec3 {
    x:number;
    y:number;
    z:number;

    constructor(x:number = 0, y:number = 0, z:number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

