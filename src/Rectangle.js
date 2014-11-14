
var Shape = require('./Shape');

module.exports = Shape.extend({

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
  }

});
