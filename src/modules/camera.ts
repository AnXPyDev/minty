class Camera {
    public pos:Vector;
    public scale:Vector;
    public debugScale:Vector;
    public angle:Angle;
    public toFollow: {id:number, name:string};
    public isFollowing: boolean; 
	public followTypes: string[];
	public followType: string;
	public followBy: number;
    constructor() {
        this.pos = new Vector();
        this.toFollow = {
            id:0,
            name:"none"
        }
		this.followTypes = ["exact", "lerp", "approach"];
        this.isFollowing = false;
        this.angle = new Angle("deg", 0);
        this.scale = v(1);
        this.debugScale = v(1);
		this.followType = "none";
		this.followBy = 1;
    }
    update():void {
		if(this.followType != "none") {
				let followed:Actor = Instance.get(this.toFollow.name, this.toFollow.id);
				if(this.followType == "exact") {
						this.pos.x = followed.pos.x;
						this.pos.y = followed.pos.y;
				} else if (this.followType == "approach") {
						let dir = a().between(this.pos, followed.pos).dir();
						this.pos.x = approach(this.pos.x, followed.pos.x, this.followBy * dir.x);
						this.pos.y = approach(this.pos.y, followed.pos.y, this.followBy * dir.y);
				} else if (this.followType == "lerp") {
						this.pos.x = lerp(this.pos.x, followed.pos.x, this.followBy);
						this.pos.y = lerp(this.pos.y, followed.pos.y, this.followBy);
				}
		}
	}
	follow(name:string, id:number, type:string, by:number = 1) {
		this.toFollow.id = id;
		this.toFollow.name = name;
		this.followType = type;
		this.followBy = by;
    }

}

module.exports = {
    Camera:Camera
}
