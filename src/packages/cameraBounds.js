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
        let sz = Math.max(vport.size.x, vport.size.y) * Math.max(1 / camera.scale.x, 1 / camera.scale.y) * 1.5; 
        this.size = v(sz);
    }
});