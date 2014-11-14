
var Action = require('../Action');

module.exports = Action.extend({

  init: function() { },

  onStart: function() {
    var scene = this.actions.owner.scene;

    var found = scene.findObject('CommandBar');
    if (found.length === 0){
      throw new Error('A CommandBar was not found on this scene.');
    }

    this.commandBar = found.at(0);
    this.isHovering = false;
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;

    if (obj.isHover && !this.isHovering){
      this.commandBar.showHoverMessage(obj.name);
      this.isHovering = true;
    }

    if (obj.isClicked){
      var command = this.commandBar.current;

      if (obj.onCommand && obj.onCommand.hasOwnProperty(command)){

        var cannot = obj.onCommand[command]();
        if (cannot){
          this.commandBar.showCannotMessage(cannot);
        }
      }
      else {
        this.commandBar.showCannotMessage();
      }
    }

    if (!obj.isHover && this.isHovering){
      this.commandBar.hideHoverMessage();
      this.isHovering = false;
    }

  }

});