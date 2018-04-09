function getLoadAnim():() => void {
    let i0:any = $MAIN.logo.parts[0];
    let angle:number = 0;
    let i1:any = $MAIN.logo.parts[1];
    let szm:number = 6;
    let alpha = 1;

    return function () {
        ctx.save();
        if ($MAIN.load.done == $MAIN.load.all) {
            alpha -= 0.01;
            if (alpha <= 0) {
                $MAIN.load.doneanim = true;
            }
        }
        let vsz:Vector = vport.size;
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,vsz.x,vsz.y);
        let sz:number = (Math.min(vsz.x, vsz.y) / 3) * 2 / szm;
        ctx.globalAlpha = alpha;
        ctx.translate(vsz.x / szm * (szm - 1) , vsz.y / szm * (szm -1));
        ctx.clearRect(- vsz.x / 2, -vsz.y / 2, vsz.x, vsz.y);
        //@ts-ignore
        angle = 2 * Math.PI * Math.sin(new Date() / 1000);
        //if (angle < -2 * Math.PI) {angle = 0};
        ctx.save();
        ctx.rotate(angle);
        ctx.drawImage(i0, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.save();
        ctx.rotate(-angle);
        ctx.drawImage(i1, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.restore();    
    }
}   


module.exports = {
    getLoadAnim: getLoadAnim
    
}