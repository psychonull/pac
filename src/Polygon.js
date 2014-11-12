
var Shape = require('./Shape');
var Point = require('./Point');
var _ = require('./utils');
var inside = require('point-in-polygon');

module.exports = Shape.extend({

  constructor: function(points, options){
    this.points = [];

    if(arguments.length > 0){
      this._initPoints(points);
    }

    Shape.call(this, options);
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
        this.points.push(new Point(points[i], points[i+1]));
      }
    }
  },

  isPointInside: function(point){
    var pointAsArray = [point.x, point.y];
    var pointsAsArrays = _.map(this.points, function(p){
      return [p.x, p.y];
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

    for (var i = 0; i < length; i++)
    {
        var p0 = this.points[i];
        var p1 = this.points[(i + 1) % length];
        var p2 = this.points[(i + 2) % length];

        var v0 = p0.subtract(p1);
        var v1 = p1.subtract(p2);
        var cross = v0.cross(v1);

        if (cross < 0)
        {
            negative++;
        }
        else
        {
            positive++;
        }
    }

    return (negative !== 0 && positive !== 0);
  }

});
