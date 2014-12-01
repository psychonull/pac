
var Action = require('../Action');

module.exports = Action.extend({

  name: 'Clickable',

  init: function() { },

  onStart: function() {
    if (!this.actions.owner.shape){
      throw new Error('Clickable Action requires a [shape] on the Object');
    }
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner,
      inputs = obj.game.inputs,
      cursor = inputs.cursor;

    if (obj.isClicked){
      obj.emit('click');
      return;
    }

    if (obj.active && cursor.isDown &&
      obj.shape.isPointInside(cursor.position, obj.position)) {

        inputs.register('click', obj);
    }
  }

});