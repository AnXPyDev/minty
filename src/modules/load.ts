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
        alpha = clamp(alpha, 0, 1);
        let vsz:Vector = vport.size;
        let sz:number = (Math.min(vsz.x, vsz.y) / 3) * 2 / szm;
        ctx.setAlpha(alpha);
        ctx.setFillStyle("black");
        ctx.fillRect(v(),vsz);
        ctx.translate(v(vsz.x / szm * (szm - 1) , vsz.y / szm * (szm -1)));
        //@ts-ignore
        angle = 2 * Math.PI * Math.sin(new Date() / 1000);
        //if (angle < -2 * Math.PI) {angle = 0};
        ctx.save();
        ctx.rotate(new Angle("rad", angle));
        ctx.drawImage(i0, v(-sz / 2, -sz / 2), v(sz, sz));
        ctx.restore();
        ctx.save();
        ctx.rotate(new Angle("rad", -angle));
        ctx.drawImage(i1, v(-sz / 2, -sz / 2), v(sz, sz));
        ctx.restore();
        ctx.restore();    
    }
}   


module.exports = {
    getLoadAnim: getLoadAnim
    
}