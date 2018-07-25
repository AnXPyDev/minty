def("collisionblock", class extends Actor {
    constructor(x,y,sx,sy) {
        super(v(x,y), "collisionblock");
        this.size = v(sx,sy);
        this.isHidden = true;
    }
},["solid", "static"]);