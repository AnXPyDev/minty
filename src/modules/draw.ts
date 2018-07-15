const Draw:{
    rect:(size:Vector, pos:Vector, color:string) => void,
    ellipse:(size:Vector, pos:Vector, color:string) => void
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
    }
}

module.exports = {
    Draw:Draw
}