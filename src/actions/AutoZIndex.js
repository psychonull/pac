
var Action = require('../Action');

module.exports = Action.extend({

  name: 'AutoZIndex',

  init: function(){
    var arg0 = arguments[0];

    var position, dynamic, baseZIndex;

    if (typeof arg0 === 'object'){
      position = arg0.position;
      dynamic = arg0.dynamic;
      baseZIndex = arg0.baseZIndex;
    }
    else {
      dynamic = arg0;
      position = arguments[1];
      baseZIndex = arguments[2];
    }

    this.position = position || 'feet';
    this.baseZIndex = baseZIndex || 0;

    this.dynamic = (dynamic === false && dynamic) ||
      (dynamic === true && dynamic) || false;

    this.isBlocking = false;
  },

  onStart: function() {
    var owner = this.actions.owner;

    if (typeof this.position === 'string'){

      if (!owner.shape){
        throw new
          Error('Action AutoZIndex: Expected a [position] or a [shape]');
      }

      var bounds = owner.shape.getBounds();

      var pos;
      switch(this.position){
        case 'head':
          pos = bounds.getHead();
          break;
        case 'center':
          pos = bounds.getCenter();
          break;
        case 'feet':
          pos = bounds.getFeet();
          break;
      }

      this.position = pos;
    }

  },

  onEnd: function() { },

  update: function(dt) {
    var owner = this.actions.owner,
      pos = owner.position;

    var p = this.position.add(pos);
    owner.zIndex = p.y + this.baseZIndex;

    if (owner.zIndex < 0){
      owner.zIndex = 0;
    }

    this.isFinished = !this.dynamic;
 }

});