function clamp(val:number, min:number, max:number):number {
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

function wrap(val:number, min:number, max:number):number {
    if (val < min) {
        return max - (min - val);
    } else if (val > max) {
        return min + (val - max);
    } else {
        return val;
    }
}

function wrap_np(val:number, min:number, max:number):number {
    if (val < min) {
        return max;
    } else if (val > max) {
        return min;
    } else {
        return val;
    }
}

function flip(val:number, min:number, max:number):number {
    return min - val + max;
}

function lerp(val:number, val2:number, perc:number, floor:boolean = false, floorby:number = 0):number {
    if (floor) {
        return Math.floor((val + (val2 - val) * perc) * Math.pow(10, floorby)) / Math.pow(10, floorby);
    }
    return (val + (val2 - val) * perc)
}

function approach(val:number, val2:number, amt:number):number {
    if (val2 < val) {
        return clamp(val - amt, val - val2, val);
    } else {
        return clamp(val + amt, val, val2);
    }
}

function collides(that:Actor, otherNames:string[], pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle) {
    let final:{is:boolean, other:any} = {is:false, other:{}};
    if(that.isCollidable) {
        let p1 = MorphPolygon(that.mask, that, pos, size, angle);
        otherNames.forEach(otherName => {
            final.other[otherName] = [];
            for(let i = 0; i < ins[otherName].length; i++) {
                if(!(that.name == otherName && that.id == i)) {
                    let p2:Polygon;
                    if(ins[otherName][i] && ins[otherName][i].isCollidable) {
                        p2 = MorphPolygon(ins[otherName][i].mask, ins[otherName][i]);
                        if (p1.collidesRect(p2)) {
                            console.log(p1.isRect , p2.isRect);
                            if ((p1.isRect && p2.isRect) || p1.collides(p2)) {
                                final.is = true;
                                final.other[otherName].push(ins[otherName][i].id);
                            }
                        }
                    }
                }
            }
        });
    }
    return final;
}

const whenID:any = {};

function when(condition:boolean, fn:() => void) {
    let bool = false;
    let boolID:any = "" + new Error().stack;
    boolID = boolID.split("at")[2];
    boolID = boolID.split("(")[1].split(")")[0];
    if(whenID[boolID]) {
        bool = whenID[boolID]; 
    } else {
        whenID[boolID] = bool = !condition;
    }
    if (!bool && !condition) {
        whenID[boolID] = false;
    } else if (!bool && condition) {
        fn();
        whenID[boolID] = true;
    } else if (bool && !condition) {
        whenID[boolID] = false;
    } else if (bool && condition) {
        whenID[boolID] = true;
    }
}

module.exports = {
    clamp:clamp,
    wrap:wrap,
    flip:flip,
    lerp:lerp,
    wrap_np:wrap_np,
    approach:approach,
    collides:collides,
    whenID:whenID,
    when:when
}