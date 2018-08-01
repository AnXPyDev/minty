class CContext {
    public nativeCtx:CanvasRenderingContext2D;
    public t:Vector;

    constructor(nativeCtx:CanvasRenderingContext2D) {
        this.nativeCtx = nativeCtx;
        this.t = v();
    }
    arc(pos:Vector, radius:number, startAngle:Angle, endAngle:Angle, anticlockwise:boolean | undefined = undefined) {
        return this.nativeCtx.arc(pos.x - this.t.x,pos.y - this.t.y,radius,startAngle.rad,endAngle.rad,anticlockwise);
    }
    arcTo(pos1:Vector, pos2:Vector, radius:number) {
        return this.nativeCtx.arcTo(pos1.x - this.t.x, pos1.y - this.t.y, pos2.x - this.t.x, pos2.y - this.t.y, radius);
    }
    beginPath() {
        return this.nativeCtx.beginPath();
    }
    bezierCurveTo(cp1:Vector, cp2:Vector, pos:Vector) {
        return this.nativeCtx.bezierCurveTo(cp1.x - this.t.x, cp1.y - this.t.y, cp2.x - this.t.x, cp2.y - this.t.y, pos.x - this.t.x, pos.y - this.t.y);
    }
    clearRect(pos:Vector, size:Vector) {
        return this.nativeCtx.clearRect(pos.x - this.t.x, pos.y - this.t.y, size.x, size.y);
    }
    clip() {
        return this.nativeCtx.clip();
    }
    closePath() {
        return this.nativeCtx.closePath();
    }
    createImageData(imageDataOrSw:ImageData | number, sh:number | undefined = undefined):ImageData {
        return this.nativeCtx.createImageData(imageDataOrSw, sh);
    }
    createLinearGrandient(pos1:Vector, pos2:Vector):CanvasGradient {
        return this.nativeCtx.createLinearGradient(pos1.x - this.t.x, pos1.y - this.t.y, pos2.x - this.t.x, pos2.y - this.t.y);
    }
    createRadialGrandient(pos1:Vector, r1:number, pos2:Vector, r2:number):CanvasGradient {
        return this.nativeCtx.createRadialGradient(pos1.x - this.t.x, pos1.y - this.t.y, r1, pos2.x - this.t.x, pos2.y - this.t.y, r2);
    }
    drawImage(image:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, p1:Vector, s1:Vector, p2:Vector | undefined = undefined, s2:Vector | undefined = undefined) {
        if(p2) {
            //@ts-ignore
            return this.nativeCtx.drawImage(image, p1.x, p1.y, s1.x, s1.y, p2.x - this.t.x, p2.y - this.t.y, s2.x, s2.y);
        }
        return this.nativeCtx.drawImage(image, p1.x - this.t.x, p1.y - this.t.y, s1.x, s1.y);
    }
    ellipse(pos:Vector, radius:Vector, rotation:Angle, startAngle:Angle, endAngle:Angle, anticlockwise:boolean | undefined = undefined) {
        return this.nativeCtx.ellipse(pos.x - this.t.x, pos.y - this.t.y, radius.x, radius.y, rotation.rad, startAngle.rad, endAngle.rad, anticlockwise);
    }
    fill() {
        return this.nativeCtx.fill();
    }
    fillRect(pos:Vector, size:Vector) {
        return this.nativeCtx.fillRect(pos.x - this.t.x, pos.y - this.t.y, size.x, size.y);
    }
    fillText(text:string, pos:Vector, maxWidth:number | undefined = undefined) {
        return this.nativeCtx.fillText(text, pos.x - this.t.x, pos.y - this.t.y, maxWidth);
    }
    getImageData(pos:Vector, size:Vector) {
        return this.nativeCtx.getImageData(pos.x - this.t.x, pos.y - this.t.y, size.x, size.y);
    }
    lineTo(pos:Vector) {
        return this.nativeCtx.lineTo(pos.x - this.t.x, pos.y - this.t.y);
    }
    moveTo(pos:Vector) {
        return this.nativeCtx.moveTo(pos.x - this.t.x, pos.y - this.t.y);
    }
    putImageData(imagedata:ImageData, pos:Vector, dpos:Vector | undefined = undefined, dsize:Vector | undefined = undefined) {
        //@ts-ignore
        return this.nativeCtx.putImageData(imagedata, pos.x - this.t.x, pos.y - this.t.y, dpos.x, dpos.y, dsize.x, dsize.y);
    }
    quadraticCurveTo(cpos:Vector, pos:Vector) {
        return this.nativeCtx.quadraticCurveTo(cpos.x, cpos.y, pos.x, pos.y);
    }
    rect(pos:Vector, size:Vector) {
        return this.nativeCtx.rect(pos.x - this.t.x, pos.y - this.t.y, size.x, size.y);
    }
    restore() {
        return this.nativeCtx.restore();
    }
    rotate(angle:Angle) {
        this.nativeCtx.rotate(angle.rad);
    }
    save() {
        return this.nativeCtx.save();
    }
    scale(scale:Vector) {
        return this.nativeCtx.scale(scale.x, scale.y);
        this.nativeCtx.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    } 
    stroke() {
        return this.nativeCtx.stroke();
    }
    strokeRect(pos:Vector, size:Vector) {
        return this.nativeCtx.strokeRect(pos.x - this.t.x, pos.y - this.t.y, size.x, size.y);
    }
    strokeText(text:string, pos:Vector, maxWidth:number | undefined = undefined) {
        return this.nativeCtx.strokeText(text, pos.x - this.t.x, pos.y - this.t.y, maxWidth);
    }
    translate(pos:Vector) {
        return this.nativeCtx.translate(pos.x - this.t.x, pos.y - this.t.y);
    }
    setFont(value:string) {
        this.nativeCtx.font = value;
    }
    setFillStyle(value:string) {
        this.nativeCtx.fillStyle = value;
    }
    setStrokeStyle(value:string) {
        this.nativeCtx.strokeStyle = value;
    }
    setTextAlign(value:string) {
        this.nativeCtx.textAlign = value;
    }
    setAlpha(value:number) {
        this.nativeCtx.globalAlpha = value;    
    }
    setLineWidth(value:number) {
        this.nativeCtx.lineWidth = value;
    }
}

module.exports = {
    CContext:CContext
}