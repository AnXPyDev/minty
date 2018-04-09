//@ts-ignore
const Key:{
    check:(kc:number) => boolean,
    add:(evt:any) => void,
    remove:(evt:any) => void,
    mouse:(evt:any) => void,
    mousedown:(evt:any) => void,
    holder:boolean[]
} = {};

Key.holder = [];

Key.check = function (kc:number):boolean {
    return Key.holder[kc] ? true : false;
}

Key.mouse = function (evt:any):void {
    Mouse.x = evt.clientX;
    Mouse.y = evt.clientY;
}

Key.mousedown = function (evt:any) {
    //
}

Key.add = function (evt:any):void {
    Key.holder[evt.key] = true;
}

Key.remove = function (evt:any):void {
    Key.holder[evt.key] = false;
}

//@ts-ignore
const Mouse:{x:number, y:number} = {x:0, y:0};

module.exports = {
    Key:Key,
    Mouse:Mouse
}