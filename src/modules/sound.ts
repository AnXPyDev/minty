class Sound {
    public audio:HTMLAudioElement;
    public source:string;
    public instances:SoundInstance[];
    public defaultVolume:number;
    constructor(source:string) {
        this.source = source;
        this.defaultVolume = 1;
        this.audio = new Audio(source);
        this.audio.oncanplaythrough = ():void => {
            $MAIN.load.stop();
            this.audio.oncanplaythrough = ():void => {};
        }
        this.instances = [];
    }
    update() {
        for(let e = 0; e < this.instances.length; e++) {
            if(!this.instances[e]) {
                this.instances.splice(e,1);
                e--;
            } else {
                this.instances[e].id = e;
            }
        }
    }
    spawnInstance(volume:number) {
        this.instances.push(new SoundInstance(this.instances.length, this, this.source, volume));
    }
    deSpawnInstance(id:number) {
        delete this.instances[id];
        this.update();
    }
    play(volume = this.defaultVolume) {
        this.spawnInstance(volume);
    }
}

class SoundInstance {
    public audioClone:HTMLAudioElement;
    public id:number;
    constructor(id:number, parent:Sound, source:string, volume:number) {
        this.id = id;
        this.audioClone = new Audio(source);
        this.audioClone.volume = volume;
        this.audioClone.play();
        this.audioClone.onpause = () => {
            parent.deSpawnInstance(this.id);
        }
    }
}

module.exports = {
    Sound:Sound,
    SoundInstance:SoundInstance
}