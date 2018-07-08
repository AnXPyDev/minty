class SpacialGrid {
    public grid:any[][];
    public block:Vector;
    constructor() {
        this.grid = [];
        this.block = v(64,64);
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
            if(!this.grid[i]) {
                this.grid[i] = [];
            }
            for(let e = that.spacialpos.min.y; e<that.spacialpos.max.y + 1; e++) {
                if(!this.grid[i][e]) {
                    this.grid[i][e] = {};
                }
                if(!this.grid[i][e][that.name]) {
                    this.grid[i][e][that.name] = [];
                }
                this.grid[i][e][that.name][that.id] = that;
            }
        }
    }
    reset() {
        this.grid = [];
    }
    getIns(spacialpos:{min:Vector, max:Vector}) {
        let result:any = {};
        for(let i = spacialpos.min.x; i<spacialpos.max.x + 1; i++) {
            if(this.grid[i]) {
                for(let e = spacialpos.min.y; e<spacialpos.max.y + 1; e++) {
                    if(this.grid[i][e]) {
                        let keys = Object.keys(this.grid[i][e]);
                        for(let q = 0; q<keys.length; q++) {
                            if(!result[keys[q]]) {
                                result[keys[q]] = [];
                            }
                            for(let x = 0; x<this.grid[i][e][keys[q]].length; x++) {
                                if(this.grid[i][e][keys[q]][x]) {
                                    result[keys[q]][x] = this.grid[i][e][keys[q]][x];
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
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
                            p2 = MorphPolygon(ins[otherNames[e]][i].mask, ins[otherNames[e]][i]);
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
        let p1 = MorphPolygon(that.mask, that, pos, size, angle);
        let gins = SpGrid.getIns(SpGrid.calculateBlocks(p1));
        for(let e = 0; e<otherNames.length; e++) {
            if(gins[otherNames[e]] && gins[otherNames[e]].length > 0) {
                final.other[otherNames[e]] = [];
                for(let i = 0; i < gins[otherNames[e]].length; i++) {
                    if(!(that.name == otherNames[e] && that.id == i)) {
                        let p2:Polygon;
                        if(gins[otherNames[e]][i] && gins[otherNames[e]][i].isCollidable) {
                            p2 = MorphPolygon(gins[otherNames[e]][i].mask, gins[otherNames[e]][i]);
                            console.log(otherNames[e]);
                            if (p1.collidesRect(p2)) {
                                if ((p1.isRect && p2.isRect) || p1.collides(p2)) {
                                    final.is = true;
                                    final.other[otherNames[e]].push(gins[otherNames[e]][i].id);
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
    SpacialGrid:SpacialGrid,
    collides:collides,
    collidesNew:collidesNew
}