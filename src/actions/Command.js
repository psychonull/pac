
var BaseCommand = require('./BaseCommand');
//var WalkableArea = require('../prefabs/WalkableArea');

var Command = module.exports = BaseCommand.extend({

  name: 'Command',

  init: function() {
    Command.__super__.init.apply(this, arguments);
  },

  onStart: function() {
    Command.__super__.onStart.apply(this, arguments);
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var command = this.command;

    if (this.hasCommand()){

      var cannot;
      var inventory = this.commandBar.inventory;

      if (inventory && inventory.current){
        cannot = obj.onCommand[command].call(obj, inventory.current);
        inventory.current = null;
      }
      else {
        cannot = obj.onCommand[command].call(obj);
      }

      if (cannot) {
        this.commandBar.showCannotMessage(obj, cannot);
      }

    }
    else {
      this.commandBar.showCannotMessage(obj);
    }

    if (!(obj instanceof require('../prefabs/WalkableArea'))){
      this.commandBar.resetCommand();
    }

    this.isFinished = true;
  },

});