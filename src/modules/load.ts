function getLoadAnim():() => void {
    let i0:any = $MAIN.logo.parts[0];
    let angle:number = 0;
    let i1:any = $MAIN.logo.parts[1];
    let szm:number = 6;
    let alpha = 1;

    return function () {
        ctx2.save();
        if ($MAIN.load.done == $MAIN.load.all) {
            alpha -= 0.01;
            if (alpha <= 0) {
                $MAIN.load.doneanim = true;
            }
        }
        alpha = clamp(alpha, 0, 1);
        let vsz:Vector = vport.size;
        let sz:number = (Math.min(vsz.x, vsz.y) / 3) * 2 / szm;
        ctx2.globalAlpha = alpha;
        ctx2.fillStyle = "black";
        ctx2.fillRect(0,0,vsz.x,vsz.y);
        ctx2.translate(vsz.x / szm * (szm - 1) , vsz.y / szm * (szm -1));
        //@ts-ignore
        angle = 2 * Math.PI * Math.sin(new Date() / 1000);
        //if (angle < -2 * Math.PI) {angle = 0};
        ctx2.save();
        ctx2.rotate(angle);
        ctx2.drawImage(i0, -sz / 2, -sz / 2, sz, sz);
        ctx2.restore();
        ctx2.save();
        ctx2.rotate(-angle);
        ctx2.drawImage(i1, -sz / 2, -sz / 2, sz, sz);
        ctx2.restore();
        ctx2.restore();    
    }
}   


module.exports = {
    getLoadAnim: getLoadAnim
    
}