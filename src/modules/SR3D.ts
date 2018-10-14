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
	
	// Find which side of the bounding box is this side closest to
	if(byWhichValue == "x") {
		let average = avg([fullSide[0].y, fullSide[1].y]);
		if(average < polygon.corner.min.y - polygon.corner.max.y + polygon.corner.max.y) {
			ixFullSide[1] = 1;
		} else {
			ixFullSide[1] = 3;
		}
	} else {
		let average = avg([fullSide[0].x, fullSide[1].x]);
		if(average < polygon.corner.min.x - polygon.corner.max.x + polygon.corner.max.x) {
			ixFullSide[1] = 0;
		} else {
			ixFullSide[1] = 2;
		}
	}

	// Find direction of iteration 
	let step = v();
	let angle = a().between(fullSide[0], fullSide[1]);
	let isInverted = false;
	if((angle.deg >= 315 && angle.deg <= 360) || (angle.deg >= 0 && angle.deg < 45)) {
		step = v(1,1);
	} else if(angle.deg >= 45 && angle.deg < 135) {
		isInverted = true;
		step= v(-1, -1);
	} else if(angle.deg >= 135 && angle.deg < 225) {
		step = v(-1, -1);
	} else if(angle.deg >= 225 && angle.deg < 315) {
		isInverted = true;
		step = v(1, 1);
	}
		
	// Find side of triangle closer to top of selected full side of triangle
	let average:number[] = []; // [avg y of side 1, average y of side 2]
	average[0] = avg([translatePos(sides[wrap_ol(ixFullSide[0] + 1, 0, 2)][0], step, isInverted).y, 
					  translatePos(sides[wrap_ol(ixFullSide[0] + 1, 0, 2)][1], step, isInverted).y]); 
	average[1] = avg([translatePos(sides[wrap_ol(ixFullSide[0] + 2, 0, 2)][0], step, isInverted).y, 
					  translatePos(sides[wrap_ol(ixFullSide[0] + 2, 0, 2)][1], step, isInverted).y]); 
	
	let succession = [wrap_ol(ixFullSide[0] + 1, 0, 2), wrap_ol(ixFullSide[1] + 2, 0, 2)];

	if(average[1] < average[0]) {
		succession = [wrap_ol(ixFullSide[0] + 2, 0, 2), wrap_ol(ixFullSide[1] + 1, 0, 2)];
	}
	
	let sidePoly:Polygon[] = [];
	sidePoly[0] = p();
	sidePoly[0].val = [translatePos(sides[succession[0]][0], step, isInverted), translatePos(sides[succession[0]][1], step, isInverted)];
	sidePoly[0].grabinfo();

	sidePoly[1] = p();
	sidePoly[1].val = [translatePos(sides[succession[1]][0], step, isInverted), translatePos(sides[succession[1]][1], step, isInverted)];
	sidePoly[1].grabinfo();

	sidePoly[2] = p();
	sidePoly[2].val = [translatePos(sides[ixFullSide[0]][0], step, isInverted), translatePos(sides[ixFullSide[0]][1], step, isInverted)];
	sidePoly[2].grabinfo();
	
	// Translate original polygon into new coordinate system
	let newPoly = p();
	newPoly.val = [];
	for(let i:number = 0; i < 3; i++) {
		newPoly.val.push(translatePos(polygon.val[i], step, isInverted));
	}
	newPoly.grabinfo();
	
	console.log({sidePoly:sidePoly, sides:sides, newPoly:newPoly, step:step, isInverted:isInverted, average:average, ixFullSide:ixFullSide, fullSide:fullSide, succession:succession, angle:angle});

	// Loop through every point in triangle
	let y = 0;
	let scix = 0; // Index of secondary polygon face
	
	let tt = v(); // Translation to 0,0
		
	let x0 = 0;
	let x1 = 0;
	while(true) {
		x0 = ((y / (sidePoly[2].corner.max.y - sidePoly[2].corner.min.y)) * (sidePoly[2].corner.max.x - sidePoly[2].corner.min.x)) + sidePoly[2].corner.min.x;
		x1 = ((y / (sidePoly[scix].corner.max.y - sidePoly[scix].corner.min.y)) * (sidePoly[scix].corner.max.x - sidePoly[scix].corner.min.x)) + sidePoly[scix].corner.min.x;
		console.log({x0:x0, x1:x1, scix:scix});
		for(let x:number = x0; x < x1; x++) {
			forPoint(translatePos(v(x, y), step, isInverted));
		}
		y += 1;
		if(y > newPoly.corner.max.y - newPoly.corner.min.y) {
			break;
		}
		if(y > sidePoly[scix].corner.max.y) {
			scix += 1;
		}
	}

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

