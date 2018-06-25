function placeEventHooks() {
    
}

class AcEvent {
    public type:string;
    public evtname:string;
    constructor(type:string, eventname:string) {
        this.type = type;
        this.evtname = eventname;
    }
}

class KeyEvent extends AcEvent {
    constructor(eventname:string) {
        super("key", eventname);
    }

}



module.exports = {

}