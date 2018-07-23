class Particle {
    public pos:Vector;
    public size:Vector;
    public velocity:Vector;
    public life:number;

    constructor(pos:Vector, size:Vector, angle:Angle, speed:number, life:number) {
        this.pos = pos;
        this.size = size;
        this.velocity = angle.dir();
        this.velocity.x *= speed;
        this.velocity.y *= speed;
        this.life = life;
    }

    update() {
        if(this.life > 0) {
            this.pos.x += this.velocity.x;
            this.pos.y += this.velocity.y;
        }
        this.life--;
    }
}

