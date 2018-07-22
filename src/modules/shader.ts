class Shader {
    public condition:(c:Color) => [boolean, number];
    public shader:(c:Color, args:any[]) => Color;
    constructor(condition:(c:Color) => [boolean, number], shader:(c:Color, args:any[]) => Color) {
        this.condition = condition;
        this.shader = shader;
    }

    applySz(pos:Vector, size:Vector, args:any[] = [], cx:CanvasRenderingContext2D = ctx) {
        this.apply(v(pos.x - size.x / 2, pos.y - size.y / 2), v(pos.x + size.x / 2, pos.y + size.y / 2), args, cx);
    }

    apply(from:Vector, to:Vector, args:any[] = [], cx:CanvasRenderingContext2D = ctx) {
        from = v(from.x - camera.pos.x + vport.ssize / 2, from.y - camera.pos.y + vport.ssize / 2);
        to = v(to.x - camera.pos.x + vport.ssize / 2, to.y - camera.pos.y + vport.ssize / 2);
        let imgdata = cx.getImageData(from.x, from.y, to.x - from.x, to.y - from.y);
        let newimgdata = cx.createImageData(to.x - from.x, to.y - from.y);
        for(let i = 0; i < imgdata.data.length; i += 4) {
            let color = new Color(
                imgdata.data[i],
                imgdata.data[i+1],
                imgdata.data[i+2],
                imgdata.data[i+3]
            );
            let cond = this.condition(color);
            if(cond[0]) {
                let newcolor = this.shader(color, args);
                newimgdata.data[i] = newcolor.r;
                newimgdata.data[i+1] = newcolor.g;
                newimgdata.data[i+2] = newcolor.b;
                newimgdata.data[i+3] = newcolor.a;
            }
        }
        cx.putImageData(newimgdata, from.x, from.y);
    }
}

class Color {
    public r:number;
    public g:number;
    public b:number;
    public a:number;
    constructor(r:number,g:number,b:number,a:number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.clamp();
    }
    clamp() {
        this.r = clamp(this.r, 0, 255);
        this.g = clamp(this.g, 0, 255);
        this.b = clamp(this.b, 0, 255);
        this.a = clamp(this.a, 0, 255);
    }
}

module.exports = {
    Shader:Shader,
    Color:Color
}