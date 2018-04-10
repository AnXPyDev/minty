
obtain("../build/modules/display.js");
obtain("../build/modules/math.js");

//@ts-ignore
const Key:{
    check:(kc:number) => boolean,
    add:(evt:any) => void,
    remove:(evt:any) => void,
    mouse:(evt:any) => void,
    mousedown:(evt:any) => void,
    mouseup:(evt:any) => void,
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
    Key.add({key:"mouse"});
    $MAIN.mAPI.compile($MAIN.mLAY);
}

Key.mouseup = function (evt:any) {
    Key.remove({key:"mouse"});
}

Key.add = function (evt:any):void {
    Key.holder[evt.key] = true;
}

Key.remove = function (evt:any):void {
    Key.holder[evt.key] = false;
}


//@ts-ignore
const Mouse:Vector = new Vector();

class MCompiler extends Compiler {
    constructor() {
        super();
    }
    compile(layers:Layers) {
        for (let i in layers.arr) {
            for (let e in layers.arr[i]) {
                if (layers.arr[i][e]()) {
                    return;
                }
            }
        }
    }
}

module.exports = {
    Key:Key,
    Mouse:Mouse,
    MCompiler:MCompiler
}