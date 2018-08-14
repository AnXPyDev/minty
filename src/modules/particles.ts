obtain("../compiled/modules/actor.js");

class Particle {
    public pos:Vector;
    public sprite:Sprite;
    public life:number;
    public size:Vector;
    public velocity:Vector;

    constructor(pos:Vector, life:number, imgname:string, len:number = 1, fps:number = 0) {
        this.pos = v(pos.x, pos.y);
        this.life = life;
        this.size = v();
        this.velocity = v();
        this.sprite = new Sprite([imgname], len, fps);
    }

    update():[boolean, () => void] {
        this.life --;
        if(this.life <= 0) {
            return [true, () => {}];
        }
        this.tick();
        this.sprite.update();
        return [false, () => {this.draw()}];
    }

    tick() {}

    draw() {
        this.sprite.draw(this.pos, this.size);
    }
}

class Emitter extends Actor {
    public particleList:Particle[];

    constructor(spawnfn:() => void, tps:number, name:string = "default_emitter") {
        super(v(), name);
        this.particleList = [];
        this.loop("spawn", spawnfn, tps);
    }

    tick() {
        let deleteList = [];
        for(let i = 0; i < this.particleList.length; i++) {
            let upd = this.particleList[i].update();
            if(!upd[0]) {
                $MAIN.cLAY.insert(new Layer(this.depth, upd[1]));
            } else {
                deleteList.push(i);
            }
        }
        for(let e = 0; e < deleteList.length; e++) {
            this.particleList.splice(deleteList[e], 1);
        }
    }

    spawnParticle(particle:Particle, ...args:any[]) {
        //@ts-ignore
        this.particleList.push(new particle(...args));
    }

    spawn() {

    }
}

module.exports = {
    Emitter:Emitter,
    Particle:Particle
}