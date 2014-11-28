
var Shape = require('./Shape');
var Point = require('./Point');
var _ = require('./utils');
var inside = require('point-in-polygon');

module.exports = Shape.extend({

  name: 'Polygon',

  constructor: function(points, options){
    this.points = [];
    var newPoints = points || (options && options.points) || [];

    Shape.call(this, options);
    this._initPoints(newPoints);
  },

  _initPoints: function(points){

    if(!_.isArray(points)){
      throw new Error('Invalid argument: ' + points);
    }

    if(points[0] instanceof Point){
      this.points = points;
    }

    else if(typeof points[0] === 'number'){

      for(var i=0; i<points.length; i+=2){
        var p = new Point(points[i], points[i+1]);
        this.points.push(p.add(this.position));
      }

    }
  },

  isPointInside: function(point, offset){
    var pointAsArray = [point.x, point.y];

    var pos = new Point();
    if (offset){
      pos = pos.add(offset);
    }

    var pointsAsArrays = _.map(this.points, function(p){
      var offsetP = p.add(offset);
      return [offsetP.x, offsetP.y];
    });

    return inside(pointAsArray, pointsAsArrays);
  },

  getPath: function(){
    return _(this.points).map(function(p){
      return [p.x, p.y];
    })
    .flatten()
    .valueOf();
  },

  isConcave: function(){
    var positive = 0,
      negative = 0,
      length = this.points.length;

    for (var i = 0; i < length; i++) {
      var p0 = this.points[i];
      var p1 = this.points[(i + 1) % length];
      var p2 = this.points[(i + 2) % length];

      var v0 = p0.subtract(p1);
      var v1 = p1.subtract(p2);
      var cross = v0.cross(v1);

      if (cross < 0) {
        negative++;
      }
      else {
        positive++;
      }
    }

    return (negative !== 0 && positive !== 0);
  },

  nearestPoint: function(point, offset){
    var pos = new Point();
    if (offset){
      pos = pos.add(offset);
    }

    var len = this.points.length;
    var fdist = Number.POSITIVE_INFINITY;
    var closest;

    for (var i=0; i<len; i++){
      var next = i<len-1 ? i+1 : 0;

      var found = this._getClosestToSegment(
        point,
        pos.add(this.points[i]),
        pos.add(this.points[next])
      );

      var dist = point.subtract(found).length();

      if (dist < fdist){
        fdist = dist;
        closest = found;
      }
    }

    return closest;
  },

  // TODO: move this away from Polygon Class
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
