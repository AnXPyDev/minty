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

module.exports = {
    clamp:clamp,
    wrap:wrap,
    flip:flip,
    lerp:lerp,
    approach:approach
}