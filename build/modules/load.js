"use strict";
function getLoadAnim() {
    let i0 = $MAIN.logo.parts[0];
    let angle = 0;
    let i1 = $MAIN.logo.parts[1];
    return function (c) {
        ctx.save();
        let vsz = vport.size;
        let sz = (Math.min(vsz.x, vsz.y) / 3) * 2;
        //@ts-ignore
        ctx.translate(vsz.x / 2, vsz.y / 2);
        ctx.clearRect(-vsz.x / 2, -vsz.y / 2, vsz.x, vsz.y);
        //@ts-ignore
        angle = 2 * Math.PI * Math.sin(new Date() / 1000);
        if (angle < -2 * Math.PI) {
            angle = 0;
        }
        ;
        ctx.save();
        ctx.rotate(angle);
        ctx.drawImage(i0, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.save();
        ctx.rotate(-angle);
        ctx.drawImage(i1, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
        ctx.restore();
    };
}
module.exports = {
    getLoadAnim: getLoadAnim
};
