class Background {
    public type:string;
    public img:HTMLImageElement;
    public color:string;
    public x:number;y:number;

    private types:string[];

    constructor(imgname:string, type:string, color:string = "white") {
        this.img = img[imgname];
        this.types = ["solid", "single", "fullscreen", "tiled"];
        this.type = (():string => {
            //@ts-ignore
            if (this.types.includes(type)) {
                return type;
            }
            return "solid";
        })();
        this.color = color;
        this.x = 0;
        this.y = 0;
    }
}