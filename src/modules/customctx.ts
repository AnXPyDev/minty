class CContext {
    public nativeCtx:CanvasRenderingContext2D;
    constructor(nativeCtx:CanvasRenderingContext2D) {
        this.nativeCtx = nativeCtx;
    }
    arc(pos:Vector, radius:number, startAngle:Angle, endAngle:Angle, anticlockwise:boolean | undefined = undefined) {
        this.nativeCtx.arc(pos.x,pos.y,radius,startAngle.rad,endAngle.rad,anticlockwise);
    }
    arcTo(pos1:Vector, pos2:Vector, radius:number) {
        this.nativeCtx.arcTo(pos1.x, pos1.y, pos2.x, pos2.y, radius);
    }
    beginPath() {
        this.nativeCtx.beginPath();
    }
    bezierCurveTo(cp1:Vector, cp2:Vector, pos:Vector) {
        this.nativeCtx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, pos.x, pos.y);
    }
    clearRect(pos:Vector, size:Vector) {
        this.nativeCtx.clearRect(pos.x, pos.y, size.x, size.y);
    }
    clip() {
        this.nativeCtx.clip();
    }
    closePath() {
        this.nativeCtx.closePath();
    }
    createImageData(imageDataOrSw:ImageData | number, sh:number | undefined = undefined):ImageData {
        return this.nativeCtx.createImageData(imageDataOrSw, sh);
    }
    createLinearGrandient(pos1:Vector, pos2:Vector):CanvasGradient {
        return this.nativeCtx.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);
    }
    createRadialGrandient(pos1:Vector, r1:number, pos2:Vector, r2:number):CanvasGradient {
        return this.nativeCtx.createRadialGradient(pos1.x, pos1.y, r1, pos2.x, pos2.y, r2);
    }
    drawImage(image:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, p1:Vector, s1:Vector, p2:Vector | undefined = undefined, s2:Vector | undefined = undefined) {
        if(p2) {
            //@ts-ignore
            this.nativeCtx.drawImage(image, p1.x, p1.y, s1.x, s1.y, p2.x, p2.y, s2.x, s2.y);
            return;
        }
        this.nativeCtx.drawImage(image, p1.x, p1.y, s1.x, s1.y);
    }
    ellipse(pos:Vector, radius:Vector, rotation:Angle, startAngle:Angle, endAngle:Angle, anticlockwise:boolean | undefined = undefined) {
        this.nativeCtx.ellipse(pos.x, pos.y, radius.x, radius.y, rotation.rad, startAngle.rad, endAngle.rad, anticlockwise);
    }
    fill() {
        this.nativeCtx.fill();
    }
    fillRect(pos:Vector, size:Vector) {
        this.nativeCtx.fillRect(pos.x, pos.y, size.x, size.y);
    }
    fillText(text:string, pos:Vector, maxWidth:number | undefined = undefined) {
        this.nativeCtx.fillText(text, pos.x, pos.y, maxWidth);
    }
    getImageData(pos:Vector, size:Vector) {
        return this.nativeCtx.getImageData(pos.x, pos.y, size.x, size.y);
    }
    lineTo(pos:Vector) {
        this.nativeCtx.lineTo(pos.x, pos.y);
    }
    moveTo(pos:Vector) {
        this.nativeCtx.moveTo(pos.x, pos.y);
    }
    putImageData(imagedata:ImageData, pos:Vector, dpos:Vector | undefined = undefined, dsize:Vector | undefined = undefined) {
        //@ts-ignore
        this.nativeCtx.putImageData(imagedata, pos.x, pos.y, dpos.x, dpos.y, dsize.x, dsize.y);
    }
    quadraticCurveTo(cpos:Vector, pos:Vector) {
        this.nativeCtx.quadraticCurveTo(cpos.x, cpos.y, pos.x, pos.y);
    }
    rect(pos:Vector, size:Vector) {
        this.nativeCtx.rect(pos.x, pos.y, size.x, size.y);
    }
    restore() {
        this.nativeCtx.restore();
    }
    rotate(angle:Angle) {
        this.nativeCtx.rotate(angle.rad);
    }
    save() {
        this.nativeCtx.save();
    }
    scale(scale:Vector) {
        this.nativeCtx.scale(scale.x, scale.y);
        this.nativeCtx.imageSmoothingEnabled = $MAIN.game_cfg.imgSmoothing;
    } 
    stroke() {
        this.nativeCtx.stroke();
    }
    strokeRect(pos:Vector, size:Vector) {
        this.nativeCtx.strokeRect(pos.x, pos.y, size.x, size.y);
    }
    strokeText(text:string, pos:Vector, maxWidth:number | undefined = undefined) {
        this.nativeCtx.strokeText(text, pos.x, pos.y, maxWidth);
    }
    translate(pos:Vector) {
        this.nativeCtx.translate(pos.x, pos.y);
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