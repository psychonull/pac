
var Action = require('../Action');

module.exports = Action.extend({

  init: function() { },

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var cursor = obj.game.inputs.cursor;

    obj.isClicked = false;

    if (cursor.isDown){

      var rect = {
        x: obj.position.x,
        y: obj.position.y,
        width: obj.size.width,
        height: obj.size.height
      };

      if(this.hasCollide(cursor.position, rect)){
        obj.isClicked = true;
        obj.emit('click');
      }
    }
  },

  hasCollide: function(point, rect){
    return (
      point.x > rect.x && point.x < rect.x + rect.width &&
      point.y > rect.y && point.y < rect.y + rect.height
    );
  }

});