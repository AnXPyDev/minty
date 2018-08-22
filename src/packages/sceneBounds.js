def("sceneBounds", class extends Actor {
    constructor() {
        super(v(), "sceneBounds");
        this.size = scene.size;
        this.isCollidable = true;
        this.isPersistant = true;
        this.isHidden = true;
        this.isRoundedPosAfterTick = false;
    }
    tick() {
        this.size = scene.size;
    }
});