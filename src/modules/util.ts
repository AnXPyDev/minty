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
        return clamp(val - amt, val2, val);
    } else {
        return clamp(val + amt, val, val2);
    }
}



const whenID:any = {};

function when(condition:boolean, fn:() => void = () => {}):boolean {
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
        return true;
    } else if (bool && !condition) {
        whenID[boolID] = false;
    } else if (bool && condition) {
        whenID[boolID] = true;
    }
    return false;
}

function wave(min:number, max:number, speed:number) {
    return min + ((max - min) / 2) + Math.sin(tick / Math.pow(10, 10 / speed)) * ((max - min) / 2); 
}

function chance(perc:number) {
    return Math.random() <= perc / 100;
}

function outside_scene(that:Actor) {
    let p = MorphPolygon(that.mask, that);
    return (
    scene.size.x / 2 < p.corner.max.x || -scene.size.x / 2 > p.corner.min.x || scene.size.y / 2 < p.corner.max.y || -scene.size.y / 2 > p.corner.min.y
  );
}

function pos_to_sz(min:Vector, max:Vector):{size:Vector, pos:Vector} {
    return {size: v(max.x - min.x, max.y - min.y), pos:v((max.x - min.x) / 2 + min.x, (max.y - min.y) / 2 + min.y)};
}

module.exports = {
    clamp:clamp,
    wrap:wrap,
    flip:flip,
    lerp:lerp,
    wrap_np:wrap_np,
    approach:approach,
    whenID:whenID,
    when:when,
    wave:wave,
    chance:chance,
    outside_scene:outside_scene,
    pos_to_sz:pos_to_sz
}