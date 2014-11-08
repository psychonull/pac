
var Action = require('../Action');

module.exports = Action.extend({

  init: function() { },

  onStart: function() {
    this.isHover = false;
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var cursor = obj.game.inputs.cursor;

    obj.isHover = this.isHover;

    var rect = {
      x: obj.position.x,
      y: obj.position.y,
      width: obj.size.width,
      height: obj.size.height
    };

    if (!this.isHover){

      if(this.hasCollide(cursor.position, rect)){
        this.isHover = true;
        obj.isHover = true;
        obj.emit('hover:in');
      }

      return;
    }

    if(!this.hasCollide(cursor.position, rect)){
      this.isHover = false;
      obj.isHover = false;
      obj.emit('hover:out');
    }
  },

  hasCollide: function(point, rect){
    return (
      point.x > rect.x && point.x < rect.x + rect.width &&
      point.y > rect.y && point.y < rect.y + rect.height
    );
  }

});