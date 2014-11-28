
var Shape = require('./Shape');

module.exports = Shape.extend({

  name: 'Circle',
  radius: 50,

  constructor: function(options){
    this.radius = (options && options.radius) || this.radius;
    Shape.apply(this, arguments);
  },

  isPointInside: function(point, offset){
    var pos = this.position;

    if (offset){
      pos = pos.add(offset);
    }

    return point.subtract(pos).length() <= this.radius;
  },

  nearestPoint: function(point, offset){
    var pos = this.position;

    if (offset){
      pos = pos.add(offset);
    }

    var near = point.subtract(pos).normalize(this.radius);
    return near.add(pos);
  },

});
