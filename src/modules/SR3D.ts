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

function loop3SidedPoly(polygon:Polygon, screenSize:Vector, forPoint:(pos:Vector) => void) {
	// All sides of polygon into Vector[]
	let sides:Vector[][] = [];
	for(let i:number = 0; i < 3; i++) {
		sides.push([polygon.val[i], polygon.val[wrap_ol(i+1, 0, 2)]])
	}
	
	let pCenter = v(polygon.corner.min.x - polygon.corner.max.x + polygon.corner.max.x, polygon.corner.min.y - polygon.corner.max.y + polygon.corner.max.y);
		
	// Find first face of polygon that completely covers a face of the bounding box of the polygon
	let ixFullSide = [0,0]; // [index of side in polygon, index of bounding box side]
	let fullSide:Vector[] = [];
	let byWhichValue:string = "x";
	for(let i:number = 0; i < 3; i++) {
		let is = false;
		let current:Vector[] = [polygon.val[i],polygon.val[wrap_ol(i+1, 0, 2)]];
		// Checks if any both x/y values are equal to corner values of the bounding box
		// If yes then returns index of the side and the side as a Vector Array itself
		// There should be a side like this in any three sided polygon 
		for(let e:number = 0; e < 3; e++) {
			if((current[e].x == polygon.corner.min.x &&
			    current[wrap_ol(e+1, 0, 1)].x == polygon.corner.max.x)) {
				
				byWhichValue = "x";
				is = true;
			} else if (
			    (current[e].y == polygon.corner.min.y &&
				current[wrap_ol(e+1, 0, 1)].y == polygon.corner.max.y)) {
					
				byWhichValue = "y";
				is = true;
			}

			if(is) {
				ixFullSide[0] = i;
				fullSide = current;
				break;
			}
		}
	
		if(is) {break}
	

	}
	
	let step = v();
	let isInverted = false;
	// Find which side of the bounding box is this side closest to
	if(byWhichValue == "x") {
		let average = avg([fullSide[0].y, fullSide[1].y]);
		if(average < polygon.corner.min.y + (polygon.corner.max.y - polygon.corner.min.y) / 2) {
			ixFullSide[1] = 0;
			step = v(-1,1);
			isInverted = true;
		} else {
			ixFullSide[1] = 2;
			step = v(1,-1);
			isInverted = true;
		}
	} else {
		let average = avg([fullSide[0].x, fullSide[1].x]);
		if(average < polygon.corner.min.x + (polygon.corner.max.x - polygon.corner.min.x) / 2) {
			ixFullSide[1] = 1;
			step = v(1);
		} else {
			ixFullSide[1] = 3;
			step = v(-1);
		}
	}
	

	console.log(ixFullSide, fullSide, step, isInverted);

}

function translatePos(pos:Vector, step:Vector, isInverted:boolean):Vector {
	if(isInverted) {
		return v(pos.y * step.y, pos.x * step.x);
	} else {
		return v(pos.x * step.x, pos.y * step.y);
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

module.exports = {
 	loop3SidedPoly:loop3SidedPoly,
	translatePos:translatePos
}

