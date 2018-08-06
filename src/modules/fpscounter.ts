class FpsCounter {
    public last:number;
    public now:number;
    public total:number;
    public text:string;
    public color:string;
    public upd:Loop;
    constructor(text:string, color:string) {
        this.last = 0;
        this.now = 0;
        this.total = 0;
        this.text = text;
        this.color = color;
        this.upd = new Loop(() => {
            this.total = Math.round(1000 / (this.now - this.last));
        }, 10)
    }
    before() {
        this.last = this.now;
    }
    after() {
        this.now = performance.now();
        this.upd.update();
    }
    draw(pos:number) {
        ctx.save();
        ctx.setFillStyle("black");
        ctx.translate(v(8 + 8 * pos + 64 * pos + 64 / 2,8 + 32 /2))
        ctx.fillRect(v(-32,-16), v(64, 32));
        ctx.setTextAlign("center");
        ctx.setFillStyle(this.color);
        ctx.setFont(`16px Arial`);
        ctx.fillText(`${this.text}: ${this.total}`, v(0, 4), 64);
        ctx.restore();
    }
}

module.exports = {
    FpsCounter:FpsCounter
}