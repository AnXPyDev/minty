class Shader {
    public condition:(c:Color) => [boolean, number];
    public shader:(c:Color, args:any[]) => Color;
    constructor(condition:(c:Color) => [boolean, number], shader:(c:Color, args:any[]) => Color) {
        this.condition = condition;
        this.shader = shader;

    }
    apply(from:Vector, to:Vector, ...args:any[]) {
        let imgdata = ctx.getImageData(from.x, from.y, to.x - from.x, to.y - from.y);
        let newimgdata = ctx.createImageData(to.x - from.x, to.y - from.y);
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
                newimgdata.data[i] = lerp(color.r, newcolor.r, cond[1]);
                newimgdata.data[i+1] = lerp(color.g, newcolor.g, cond[1]);
                newimgdata.data[i+2] = lerp(color.b, newcolor.b, cond[1]);
                newimgdata.data[i+3] = lerp(color.a, newcolor.a, cond[1]);
                //console.log("xd");
            }
        }
        ctx.putImageData(newimgdata, from.x, from.y);
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