
var Action = require('../Action');
var Hoverable = require('./Hoverable');
var Clickable = require('./Clickable');

module.exports = Action.extend({

  requires: [ Hoverable, Clickable ],

  init: function() { },

  onStart: function() {
    var game = this.actions.owner.game;

    this.commandBar = game.findOne('CommandBar');
    if (!this.commandBar){
      throw new Error('A CommandBar was not found.');
    }

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

      if (obj.isInInventory){
        var join = this._onInventoryCommand(obj, command);
        if (join) { return; } //made a join nothing else to do
      }

      this._onCommand(obj, command);
    }

    if (!obj.isHover && this.isHovering){
      this.commandBar.hideHoverMessage();
      this.isHovering = false;
    }

  },

  _onInventoryCommand: function(obj, command){
    var inventory = this.commandBar.inventory,
      invCommands = this.commandBar.inventoryCommands;

    if (inventory && !inventory.current &&
      invCommands && invCommands.hasOwnProperty(command)){

      inventory.current = obj.name;
      this.commandBar.showHoverMessage(obj.name);
      return true;
    }

    return false;
  },

  _onCommand: function(obj, command){

    if (obj.onCommand && obj.onCommand.hasOwnProperty(command)){

      var cannot;
      var inventory = this.commandBar.inventory;

      if (inventory && inventory.current){
        cannot = obj.onCommand[command].call(obj, inventory.current);
        inventory.current = null;
      }
      else {
        cannot = obj.onCommand[command].call(obj);
      }

      if (cannot){
        this.commandBar.showCannotMessage(cannot);
      }
    }
    else {
      this.commandBar.showCannotMessage();
    }
  }

});