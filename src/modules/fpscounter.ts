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
        ctx.translate(v((8 + 8 * pos + 64 * pos + 64 / 2) * vport.zoomFactor,(8 + 32 /2) * vport.zoomFactor))
        ctx.fillRect(v(-32 * vport.zoomFactor,-16 * vport.zoomFactor), v(64 * vport.zoomFactor, 32 * vport.zoomFactor));
        ctx.setTextAlign("center");
        ctx.setFillStyle(this.color);
        ctx.setFont(`${16 * vport.zoomFactor}px Arial`);
        ctx.fillText(`${this.text}: ${this.total}`, v(0, 4 * vport.zoomFactor), 64 * vport.zoomFactor);
        ctx.restore();
    }
}

module.exports = {
    FpsCounter:FpsCounter
}