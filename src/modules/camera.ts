class Camera {
    public pos:Vector;
    public toFollow: {id:number, name:string};
    public isFollowing: boolean; 
    constructor() {
        this.pos = new Vector();
        this.toFollow = {
            id:0,
            name:"none"
        }
        this.isFollowing = false;
    }
    update():void {}

}

module.exports = {
    Camera:Camera
}