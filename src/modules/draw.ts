const Draw:{
    rect:(size:Vector, pos:Vector, color:string) => void,
    rectS:(size:Vector, pos:Vector, color:string, width:number) => void,
    ellipse:(size:Vector, pos:Vector, color:string) => void,
    ellipseS:(size:Vector, pos:Vector, color:string, width:number) => void,
    scale:(scale:Vector, pos:Vector, callback:() => void) => void
} = {
    rect(size,pos,color) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.fillStyle = color;
        ctx.fillRect(-size.x / 2, -size.y / 2, size.x, size.y);
        ctx.restore();
    },
    ellipse(size,pos,color) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.translate(pos.x, pos.y);
        ctx.scale(1, size.y / size.x);
        ctx.beginPath();
        ctx.arc(0, 0, size.x / 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.restore();
    },
    ellipseS(size,pos,color,width) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.translate(pos.x, pos.y);
        ctx.scale(1, size.y / size.x);
        ctx.beginPath();
        ctx.arc(0, 0, size.x / 2, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.restore();
    },
    rectS(size,pos,color,width) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.translate(pos.x, pos.y);
        ctx.scale(1, size.y / size.x);
        ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
        ctx.restore();
    },
    scale(scale, pos, callback) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.scale(scale.x, scale.y);
        callback();
        ctx.restore();
    }
}

module.exports = {
    Draw:Draw
}