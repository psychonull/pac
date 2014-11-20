
var Action = require('../Action');
var _ = require('../utils');
var DialogueManager = require('../prefabs/DialogueManager');
var Command = require('./Command');

module.exports = Action.extend({

  requires: [Command],
  options: null,
  command: 'talkto',

  init: function(options) {
    this.options = options || this.options;
    this.command = (options && options.command) || this.command;
  },

  onStart: function() {
    var owner = this.actions.owner;
    owner.dialogue = new DialogueManager(this.options);
    if(!owner.onCommand){
      owner.onCommand = {};
    }
    owner.onCommand[this.command] = _.bind(this.onDialogueCommand, this);
  },

  onEnd: function() {
    var owner = this.actions.owner;
    delete owner.dialogue;
    delete owner.onCommand[this.command];
  },

  update: function(dt) { },

  onDialogueCommand: function(){
    this.actions.owner.dialogue.next();
  }

});
