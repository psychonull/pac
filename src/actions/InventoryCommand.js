
var BaseCommand = require('./BaseCommand');
var Command = require('./Command');

var InventoryCommand = module.exports = BaseCommand.extend({

  name: 'InventoryCommand',

  init: function() {
    InventoryCommand.__super__.init.apply(this, arguments);
  },

  onStart: function() {
    InventoryCommand.__super__.onStart.apply(this, arguments);
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;

    var inventory = this.commandBar.inventory,
      invCommands = this.commandBar.inventoryCommands;

    if (inventory && !inventory.current &&
      invCommands && invCommands.hasOwnProperty(this.command)){

      inventory.current = obj.name;
      this.commandBar.showHoverMessage(obj);
    }
    else {
      this.insertBehindMe(new Command(this.command));
    }

    this.isFinished = true;
  },

});