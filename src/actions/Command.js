
var Action = require('../Action');
var Hoverable = require('./Hoverable');
var Clickable = require('./Clickable');

var WaitForWalker = require('../actions/WaitForWalker');

module.exports = Action.extend({

  requires: [ Hoverable, Clickable ],

  name: 'Command',

  init: function() { },

  onStart: function() {
    var game = this.actions.owner.game;

    this.commandBar = game.findOne('CommandBar');
    if (!this.commandBar){
      throw new Error('A CommandBar was not found.');
    }

    this.walkableArea = game.findOne('WalkableArea');

    this.isHovering = false;
    this.walkingTo = false;
    this.cancelCommand = false;
  },

  onEnd: function() { },

  update: function(dt) {
    if (!this.commandBar.active){
      return;
    }

    var obj = this.actions.owner;
    var command = this.commandBar.current;

    if (obj.isHover && !this.isHovering){
      this.isHovering = true;
      this.commandBar.showHoverMessage(obj);
    }

    if (obj.isClicked || this.walkingTo){
      this._onCommandFired(obj, command);
      return;
    }

    if (!obj.isHover && this.isHovering){
      this.isHovering = false;
      this.commandBar.hideHoverMessage(obj);
    }

  },

  _onCommandFired: function(obj, command){

    if (this.actions.has(WaitForWalker)){
      return;
    }

    if (!this.walkingTo && this._walkto(obj, command)){
      this.walkingTo = true;
      return;
    }

    if (this.walkingTo && this.cancelCommand){
      this.walkingTo = false;
      this.cancelCommand = false;
      return;
    }

    this.walkingTo = false;

    if (obj.isInInventory){
      var join = this._onInventoryCommand(obj, command);
      if (join) { return; } //made a join nothing else to do
    }

    this._runCommand(obj, command);
  },

  _walkto: function(obj, command){
    this.cancelCommand = false;

    if (obj.name === 'WalkableArea'){
      return;
    }

    if (this.walkableArea && !obj.isInInventory){
      this.cancelCommand =
        this.walkableArea.moveWalkersToObject(obj, 30, command);

      return true;
    }
  },

  _onInventoryCommand: function(obj, command){
    var inventory = this.commandBar.inventory,
      invCommands = this.commandBar.inventoryCommands;

    if (inventory && !inventory.current &&
      invCommands && invCommands.hasOwnProperty(command)){

      inventory.current = obj.name;
      this.commandBar.showHoverMessage(obj);
      return true;
    }

    return false;
  },

  _runCommand: function(obj, command){

    if (obj.onCommand &&
      obj.onCommand.hasOwnProperty(command) &&
      typeof obj.onCommand[command] === 'function'){

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
        this.commandBar.showCannotMessage(obj, cannot);
      }
    }
    else {
      this.commandBar.showCannotMessage(obj);
    }
  }

});