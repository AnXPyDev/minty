class Camera {
    public pos:Vector;
    public scale:Vector;
    public angle:Angle;
    public toFollow: {id:number, name:string};
    public isFollowing: boolean; 
    constructor() {
        this.pos = new Vector();
        this.toFollow = {
            id:0,
            name:"none"
        }
        this.isFollowing = false;
        this.angle = new Angle("deg", 0);
        this.scale = v(1,1);
    }
    update():void {}

}

module.exports = {
    Camera:Camera
}