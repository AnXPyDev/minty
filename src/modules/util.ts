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

function collides(that:Actor, otherName:string) {
    let p1 = that.mask;
    let final:{is:boolean, id:number[]} = {is:false, id:[]};
    p1.size(that.size);
    p1.center(that.pos);
    p1.rotate(that.angle);
    for(let i = 0; i < ins[otherName].length; i++) {
        let p2 = ins[otherName][i].mask;
        p2.size(ins[otherName][i].size);
        p2.center(ins[otherName][i].pos);
        p2.rotate(ins[otherName][i].angle);
        if (p1.collides(p2)) {
            final.is = true;
            final.id.push(i);
        }
    }
    return final;
}

module.exports = {
    clamp:clamp,
    wrap:wrap,
    flip:flip,
    lerp:lerp,
    wrap_np:wrap_np,
    approach:approach,
    collides:collides
}