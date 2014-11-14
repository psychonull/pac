
var Action = require('../Action');

module.exports = Action.extend({

  init: function() { },

  onStart: function() {
    if (!this.actions.owner.shape){
      throw new Error('Clickable Action requires a [shape] on the Object');
    }
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var cursor = obj.game.inputs.cursor;

    obj.isClicked = false;

    if (obj.active && cursor.isDown &&
      obj.shape.isPointInside(cursor.position, obj.position)) {

        obj.isClicked = true;
        obj.emit('click');
    }
  }

});