
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
  }

});
