"use strict";
function getLoadAnim() {
    let angle0 = 0;
    let i0 = $MAIN.logo.parts[0];
    let angle1 = 0;
    let i1 = $MAIN.logo.parts[1];
    return function (c) {
        ctx.save();
        let vsz = vport.size;
        let sz = (Math.min(vsz.x, vsz.y) / 3) * 2;
        //@ts-ignore
        ctx.translate(vsz.x / 2, vsz.y / 2);
        ctx.clearRect(-vsz.x / 2, -vsz.y / 2, vsz.x, vsz.y);
        //angle0 += Math.PI / 180 * 2;
        //@ts-ignore
        angle1 -= Math.PI / 180 * Math.sin(new Date() / 1000) * 5;
        //if (angle0 > 2 * Math.PI) {angle0 = 0};
        if (angle1 < -2 * Math.PI) {
            angle1 = 0;
        }
        ;
        ctx.save();
        //ctx.rotate(angle0);
        ctx.drawImage(i0, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.save();
        ctx.rotate(angle1);
        ctx.drawImage(i1, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.restore();
    };
}
module.exports = {
    getLoadAnim: getLoadAnim
};
