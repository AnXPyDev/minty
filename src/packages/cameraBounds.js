def("cameraBounds", class extends Actor {
    constructor() {
        super(camera.pos, "cameraBounds");
        this.size = v(vport.size.x * camera.scale.x, vport.size.y * camera.scale.y);
        this.isCollidable = true;
        this.isPersistant = true;
        this.isHidden = true;
        this.isRoundedPosAfterTick = false;
    }
    tick() {
        this.size = v(vport.size.x * camera.scale.x, vport.size.y * camera.scale.y);
    }
});