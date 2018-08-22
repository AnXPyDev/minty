const Draw:{
    rect:(size:Vector, pos:Vector, color:string) => void,
    rectS:(size:Vector, pos:Vector, color:string, width:number) => void,
    ellipse:(size:Vector, pos:Vector, color:string) => void,
    ellipseS:(size:Vector, pos:Vector, color:string, width:number) => void,
    nGon:(n:number, size:Vector, pos:Vector, color:string) => void, 
    nGonS:(n:number, size:Vector, pos:Vector, color:string, width:number) => void, 
    scale:(scale:Vector, pos:Vector, callback:() => void) => void,
    line:(pos0:Vector, pos1:Vector, color:string, width:number) => void,
    text:(text:string, pos:Vector, color:string, size:number, font:string) => void,
    opacity:(opacity:number, callback:() => void) => void,
    insert:(depth:number, callback:() => void) => void,
    angle:(angle:Angle, callback:() => void) => void
} = {
    rect(size,pos,color) {
        ctx.save();
        ctx.translate(pos);
        ctx.setFillStyle(color);
        ctx.fillRect(v(-size.x / 2, -size.y / 2), size);
        ctx.restore();
    },
    ellipse(size,pos,color) {
        ctx.save();
        ctx.setFillStyle(color);
        ctx.translate(pos);
        ctx.scale(v(1, size.y / size.x));
        ctx.beginPath();
        ctx.arc(v(), size.x / 2, new Angle("deg", 0), new Angle("rad", 2 * Math.PI), false);
        ctx.fill();
        ctx.restore();
    },
    nGon(n, size, pos, color) {
        let curs = v(1,0);
        ctx.save();
        ctx.setFillStyle(color);
        ctx.translate(pos);
        ctx.scale(size);
        ctx.beginPath();
        ctx.moveTo(curs);
        for(let i = 1; i < n + 1; i++) {
            curs.rotate(a(360 / n));
            ctx.lineTo(curs);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },
    nGonS(n, size, pos, color, width) {
        let curs = v(1,0);
        ctx.save();
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(width);
        ctx.translate(pos);
        ctx.scale(size);
        ctx.beginPath();
        ctx.moveTo(curs);
        for(let i = 1; i < n + 1; i++) {
            curs.rotate(a(360 / n));
            ctx.lineTo(curs);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    ellipseS(size,pos,color,width) {
        ctx.save();
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(width);
        ctx.translate(pos);
        ctx.scale(v(1, size.y / size.x));
        ctx.beginPath();
        ctx.arc(v(), size.x / 2, new Angle("deg", 0), new Angle("rad", 2 * Math.PI), false);
        ctx.stroke();
        ctx.restore();
    },
    rectS(size,pos,color,width) {
        ctx.save();
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(width);
        ctx.translate(pos);
        ctx.strokeRect(v(-size.x / 2 + width / 2, -size.y / 2 + width / 2), v(size.x - width, size.y - width));
        ctx.restore();
    },
    scale(scale, pos, callback) {
        ctx.save();
        ctx.translate(pos);
        ctx.scale(scale);
        callback();
        ctx.restore();
    },
    line(pos0, pos1, color, width) {
        ctx.save();
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(width);
        ctx.beginPath();
        ctx.moveTo(pos0);
        ctx.lineTo(pos1);
        ctx.stroke();
        ctx.restore();
    },
    text(text, pos, color, size, font = "Arial") {
        ctx.save();
        ctx.setFillStyle(color);
        ctx.setFont(`${size}px ${font}`);
        ctx.setTextAlign("center");
        ctx.fillText(text, pos);
        ctx.restore();
    },
    opacity(opacity, callback) {
        ctx.save();
        ctx.setAlpha(opacity);
        callback();
        ctx.restore();
    },
    insert(depth, callback) {
        $MAIN.cLAY.insert(new Layer(depth, callback));
    }, 
    angle(angle, callback) {
        ctx.save();
        ctx.rotate(angle);
        callback();
        ctx.restore();
    }
}

module.exports = {
    Draw:Draw
}