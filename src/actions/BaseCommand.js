
var Action = require('../Action');

module.exports = Action.extend({

  name: 'BaseCommand',

  init: function(options) {
    if (typeof options === 'string'){
      this.command = options;
    }
    else {
      this.command = options && options.command || this.command;
    }

    if (!this.command){
      throw new Error('Command Action: Expected a command');
    }

    this.isBlocking = true;
  },

  onStart: function() {
    var game = this.actions.owner.game;

    this.commandBar = game.findOne('CommandBar');
    if (!this.commandBar){
      throw new Error('A CommandBar was not found.');
    }

    this.walkableArea = game.findOne('WalkableArea');
  },

  onEnd: function() { },

  update: function(dt) { },

  hasCommand: function(){
    var obj = this.actions.owner;

    return obj.onCommand && obj.onCommand.hasOwnProperty(this.command) &&
      typeof obj.onCommand[this.command] === 'function';
  },

});