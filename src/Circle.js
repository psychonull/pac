
var Shape = require('./Shape');
var Rectangle = require('./Rectangle');
var Point = require('./Point');

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

  getBounds: function(offset){
    var pos = this.position;
    var radius = this.radius;

    if (offset){
      pos = pos.add(offset);
    }

    return new Rectangle({
      position: new Point(pos.x - radius, pos.y - radius),
      size: { width: radius*2, height: radius*2 }
    });
  },

});
