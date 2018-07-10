class CGHandler {
    public block:Vector;
    constructor() {
        this.block = v(32,32)
    }
    calculateBlocks(poly:Polygon):{min:Vector, max:Vector} {
        let min:Vector, max:Vector;
        min = v(Math.floor(poly.corner.min.x / this.block.x),
                Math.floor(poly.corner.min.y / this.block.y));
        max = v(Math.floor(poly.corner.max.x / this.block.x),
                Math.floor(poly.corner.max.y / this.block.y));  
        return {min:min, max:max};
    }
}


class CollisionGrid {
    public grids:number[][][][];
    public index:number;
    public nindex:number;
    constructor() {
        this.grids = [[],[]];
        this.index = 0;
        this.nindex = 1;
    }
    nextIndex() {
        this.index = wrap_np(this.index + 1, 0, 1);
        this.nindex = wrap_np(this.nindex + 1, 0, 1);
    }
    insert(spos:{min:Vector, max:Vector}, id:number) {
        let ix = [this.index, this.nindex];
        for(let i = 0; i < 2; i++) {
            for(let x = spos.min.x; x < spos.max.x +1; x++) {
                this.grids[ix[i]][x] ? 0 : this.grids[ix[i]][x] = [];
                for(let y = spos.min.y; y < spos.max.y + 1; y++) {
                    this.grids[ix[i]][x][y] ? 0 : this.grids[ix[i]][x][y] = [];
                    this.grids[ix[i]][x][y].push(id);
                }
            }
        }
    }
    request(spos:{min:Vector, max:Vector}):number[] {
        let done:boolean[] = [];
        let final:number[] = [];
        for(let x = spos.min.x; x < spos.max.x + 1; x++) {
            if(this.grids[this.index][x]) {
                for(let y = spos.min.y; y < spos.max.y + 1; y++) {
                    if(this.grids[this.index][x][y]) {
                        for(let i = 0; i < this.grids[this.index][x][y].length; i++) {
                            done[this.grids[this.index][x][y][i]] ? 0:final.push(this.grids[this.index][x][y][i]);
                            done[this.grids[this.index][x][y][i]] = true;
                        }
                    }
                }
            }
        }
        return final;
    }
    reset() {
        this.grids[this.index] = [];
    }
}

function collidesOld(that:Actor, otherNames:string[], pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle) {
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


function collides(that:Actor, otherNames:string[], pos:Vector = that.pos, size:Vector = that.size, angle:Angle = that.angle) {
    let final:{is:boolean, other:any} = {is:false, other:{}};
    if(that.isCollidable) {
        let p1 = MorphPolygon(that.mask, that, pos, size, angle);
        let spos = CGH.calculateBlocks(p1);
        for(let e = 0; e<otherNames.length; e++) {
            final.other[otherNames[e]] = [];
            let gins = ins[otherNames[e]].grid.request(spos);
            for(let i = 0; i < gins.length; i++) {
                if(!(that.name == otherNames[e] && that.id == gins[i])) {
                    let p2:Polygon;
                    if(ins[otherNames[e]][gins[i]]) {
                        p2 = ins[otherNames[e]][gins[i]].morphedMask;
                        if (p1.collidesRect(p2)) {
                            if ((p1.isRect && p2.isRect) || p1.collides(p2)) {
                                final.is = true;
                                final.other[otherNames[e]].push(gins[i]);
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
    CGHandler:CGHandler,
    CollisionGrid:CollisionGrid,
    collides:collides,
    collidesOld:collidesOld

}