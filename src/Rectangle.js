
var Shape = require('./Shape');
var Point = require('./Point');

var Rectangle = module.exports = Shape.extend({

  name: 'Rectangle',
  size: { width: 50, height: 50 },

  constructor: function(options){
    this.size = (options && options.size) || this.size;
    Shape.apply(this, arguments);
  },

  isPointInside: function(point, offset){
    var pos = this.position;

    if (offset){
      pos = pos.add(offset);
    }

    return (
      point.x > pos.x && point.x < pos.x + this.size.width &&
      point.y > pos.y && point.y < pos.y + this.size.height
    );
  },

  nearestPoint: function(point, offset){

    var points = this.getPoints(offset);

    var len = points.length;
    var fdist = Number.POSITIVE_INFINITY;
    var closest;

    for (var i=0; i<len; i++){
      var next = i<len-1 ? i+1 : 0;

      var found = this._getClosestToSegment(point, points[i], points[next]);
      var dist = point.subtract(found).length();

      if (dist < fdist){
        fdist = dist;
        closest = found;
      }
    }

    return closest;
  },

  getPoints: function(offset){
    var pos = this.position;
    var size = this.size;

    if (offset){
      pos = pos.add(offset);
    }

    return [
      new Point(pos),
      new Point(pos.x + size.width, pos.y),
      new Point(pos.x + size.width, pos.y + size.height),
      new Point(pos.x, pos.y + size.height)
    ];
  },

  getBounds: function(offset){
    var pos = this.position;

    if (offset){
      pos = pos.add(offset);
    }

    return new Rectangle({ position: pos, size: this.size });
  },

  getCenter: function(){
    var pos = this.position;
    var size = this.size;

    return new Point(pos.x + size.width/2, pos.y + size.height/2);
  },

  getHead: function(){
    var pos = this.position;
    var size = this.size;

    return new Point(pos.x + size.width/2, pos.y);
  },

  getFeet: function(){
    var pos = this.position;
    var size = this.size;

    return new Point(pos.x + size.width/2, pos.y + size.height);
  },

  // TODO: move this away from Rectangle Class
  _getClosestToSegment: function(p, pA, pB) {
    var near;

    var difA = p.subtract(pA);
    var difB = pB.subtract(pA);
    var param = difA.dot(difB) / difB.dot(difB);

    if (param < 0 || (pA.x === pB.x && pA.y === pB.y)) {
      near = pA;
    }
    else if (param > 1) {
      near = pB;
    }
    else {
      near = pA.add(new Point(difB.x*param, difB.y*param));
    }

    return near;
  }

});

