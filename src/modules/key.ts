
obtain("../compiled/modules/display.js");
obtain("../compiled/modules/math.js");

//@ts-ignore
const Key:{
    check:(kc:string) => boolean,
    add:(evt:any) => void,
    remove:(evt:any) => void,
    mouse:(evt:any) => void,
    mouselog:() => void,
    mousedown:(evt:any) => void,
    mouseup:(evt:any) => void,
    holder:any,
    mupdated:boolean,
    lastsc:Vector
} = {};

Key.holder = {};

Key.check = function (kc:string):boolean {
    return Key.holder[kc.toLowerCase()] ? true : false;
}

Key.mouse = function (evt:any):void {
    Key.lastsc = vport.screen;
    Key.mupdated = true;
    MClient.x = evt.clientX;
    MClient.y = evt.clientY;
}

Key.mouselog = function ():void {
    let pos = vport.element.getBoundingClientRect();
    Mouse.x = Math.round((((MClient.x - pos.x) / (vport.scale.x * vport.zoomFactor) - vport.size.x / 2) / camera.scale.x + camera.pos.x));
    Mouse.y = Math.round((((MClient.y - pos.y) / (vport.scale.y * vport.zoomFactor) - vport.size.y / 2) / camera.scale.y + camera.pos.y)); 
}

Key.mousedown = function (evt:any) {
    Key.add({key:"mouse"});
    $MAIN.mAPI.compile($MAIN.mLAY);
}

Key.mouseup = function (evt:any) {
    Key.remove({key:"mouse"});
}

Key.add = function (evt:any):void {
    Key.holder[evt.key.toLowerCase()] = true;
}

Key.remove = function (evt:any):void {
    Key.holder[evt.key.toLowerCase()] = false;
}

const Mouse:Vector = new Vector();
const MClient:Vector = new Vector();

class MCompiler extends Compiler {
    constructor() {
        super();
    }
    compile(layers:Layers) {
        for (let i = 0; i < layers.arr.length; i++) {
            if(layers.arr[i]) {
                for (let e = 0; e < layers.arr[i].length; e++) {
                    if (layers.arr[i][e]()) {
                        return;
                    }
                }
            }
        }
    }
}

module.exports = {
    Key:Key,
    Mouse:Mouse,
    MCompiler:MCompiler,
    MClient:MClient
}