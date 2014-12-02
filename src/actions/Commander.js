
var Action = require('../Action');
var Hoverable = require('./Hoverable');
var Clickable = require('./Clickable');

var Command = require('./Command');
var InventoryCommand = require('./InventoryCommand');
var WalkerCommand = require('./WalkerCommand');

module.exports = Action.extend({

  requires: [ Hoverable, Clickable ],

  name: 'Commander',

  init: function(options) {
    if (typeof options === 'number'){
      this.nearness = options;
    }
    else {
      this.nearness = options && options.nearness || this.nearness || 30;
    }
  },

  onStart: function() {
    var game = this.actions.owner.game;

    this.commandBar = game.findOne('CommandBar');
    if (!this.commandBar){
      throw new Error('A CommandBar was not found.');
    }

    this.walkableArea = game.findOne('WalkableArea');

    this.hovering = false;
  },

  onEnd: function() { },

  update: function(dt) {
    var obj = this.actions.owner;
    var command = this.commandBar.current;

    if (obj.isHover && !this.hovering){
      this.hovering = true;
      this.commandBar.showHoverMessage(obj);
    }

    if (obj.isClicked){
      this.onClick(obj, command);
    }

    if (!obj.isHover && this.hovering){
      this.hovering = false;
      this.commandBar.hideHoverMessage(obj);
    }
  },

  onClick: function(obj, command){

    if (obj.isInInventory){
      this.actions.pushFront(new InventoryCommand(command));
      return;
    }

    if (this.walkableArea &&
      !(obj instanceof require('../prefabs/WalkableArea'))){

      this.walkableArea.moveWalkersToObject(obj, this.nearness);

      if (this._runCommand(obj, command)){
        this.actions.pushFront(new WalkerCommand(command));
      }
    }
    else {
      this.actions.pushFront(new Command(command));
    }

  },

  _runCommand: function(obj, command){
    var runCommand = true;

    if (this.isWalkableCommand(command)){
      runCommand = this.hasCommand(obj, command);
    }

    return runCommand;
  },

  isWalkableCommand: function(command){
    return (this.walkableArea.commands &&
      this.walkableArea.commands.indexOf(command) > -1);
  },

  hasCommand: function(obj, command){
    return (obj.onCommand && obj.onCommand.hasOwnProperty(command) &&
      typeof obj.onCommand[command] === 'function');
  }

});