
var Action = require('../Action');

module.exports = Action.extend({

  init: function() { },

  onStart: function() {
    this.isHover = false;

    if (!this.actions.owner.shape){
      throw new Error('Hoverable Action requires a [shape] on the Object');
    }
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var cursor = obj.game.inputs.cursor;
    obj.isHover = this.isHover;

    if (!obj.active){
      obj.isHover = false;
      this.isHover = false;
      return;
    }

    if (!this.isHover){

      if(obj.shape.isPointInside(cursor.position, obj.position)){
        this.isHover = true;
        obj.isHover = true;
        obj.emit('hover:in');
      }

      return;
    }

    if(!obj.shape.isPointInside(cursor.position, obj.position)){
      this.isHover = false;
      obj.isHover = false;
      obj.emit('hover:out');
    }
  }

});