class CollisionGrid {
    public grids:any[][][];
    public block:Vector;
    public index:number;
    public nindex:number;
    constructor() {
        this.grids = [[],[]];
        this.block = v(64,64);
        this.index = 0;
        this.nindex = 1;
    }
    calculateBlocks(poly:Polygon):{min:Vector, max:Vector} {
        let min:Vector, max:Vector;
        min = v(Math.floor(poly.corner.min.x / this.block.x),
                Math.floor(poly.corner.min.y / this.block.y));
        max = v(Math.floor(poly.corner.max.x / this.block.x),
                Math.floor(poly.corner.max.y / this.block.y));  
        return {min:min, max:max};
    }
    assign(that:Actor) {
        for(let i = that.spacialpos.min.x; i<that.spacialpos.max.x + 1; i++) {
            if(!this.grids[this.nindex][i]) {
                this.grids[this.nindex][i] = [];
            }
            for(let e = that.spacialpos.min.y; e<that.spacialpos.max.y + 1; e++) {
                if(!this.grids[this.nindex][i][e]) {
                    this.grids[this.nindex][i][e] = {};
                }
                if(!this.grids[this.nindex][i][e][that.name]) {
                    this.grids[this.nindex][i][e][that.name] = [];
                }
                this.grids[this.nindex][i][e][that.name].push(that);
            }
        }
    }
    reset() {
        this.grids[this.index] = [];
    }
    nextIndex() {
        this.index = wrap_np(this.index + 1, 0, 1);
        this.nindex = wrap_np(this.nindex + 1, 0, 1);
    }
    get() {
        return this.grids[this.index];
    }
}

function collides(that:Actor, otherNames:string[], pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle) {
    let final:{is:boolean, other:any} = {is:false, other:{}};
    if(that.isCollidable) {
        let p1 = MorphPolygon(that.mask, that, pos, size, angle);
        for(let e = 0; e<otherNames.length; e++) {
            if(ins[otherNames[e]] && ins[otherNames[e]].length > 0) {
                final.other[otherNames[e]] = [];
                for(let i = 0; i < ins[otherNames[e]].length; i++) {
                    if(!(that.name == otherNames[e] && that.id == i)) {
                        let p2:Polygon;
                        if(ins[otherNames[e]][i] && ins[otherNames[e]][i].isCollidable) {
                            p2 = ins[otherNames[e]][i].morphedMask;
                            if (p1.collidesRect(p2)) {
                                if ((p1.isRect && p2.isRect) || p1.collides(p2)) {
                                    final.is = true;
                                    final.other[otherNames[e]].push(ins[otherNames[e]][i].id);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return final;
}

function collidesNew(that:Actor, otherNames:string[], pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle) {
    let final:{is:boolean, other:any} = {is:false, other:{}};
    if(that.isCollidable) {
        let done:any = {};
        let p1 = MorphPolygon(that.mask, that, pos, size, angle);
        let p2;
        let gridpos = CG.calculateBlocks(p1);
        let grid = CG.get();
        console.log(that.name, grid);
        for(let x = gridpos.min.x; x<gridpos.max.x + 1; x++) {
            if (grid[x]) {
                for(let y = gridpos.min.y; y<gridpos.max.y + 1; y++) {
                    if (grid[x][y]) {
                        let keys = Object.keys(grid[x][y]);
                        for(let i = 0; i<keys.length; i++) {
                            if(otherNames.includes(keys[i])) {
                                if(!final.other[keys[i]]) {
                                    final.other[keys[i]] = [];
                                }
                                for(let e = 0; e<grid[x][y][keys[i]].length; e++) {
                                    if(keys[i] != that.name && grid[x][y][keys[i]][e].id != that.id) {
                                        p2 = grid[x][y][keys[i]][e].morphedMask;
                                        
                                        if (p1.collidesRect(p2)) {
                                            if ((p1.isRect && p2.isRect) || p1.collides(p2)) {
                                                final.is = true;
                                                final.other[keys[i]].push();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return final;
}



module.exports = {
    CollisionGrid:CollisionGrid,
    collides:collides,
    collidesNew:collidesNew
}