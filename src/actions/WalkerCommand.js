
var BaseCommand = require('./BaseCommand');
var Command = require('./Command');

var WalkerCommand = module.exports = BaseCommand.extend({

  name: 'WalkerCommand',

  init: function() {
    WalkerCommand.__super__.init.apply(this, arguments);
  },

  onStart: function() {
    WalkerCommand.__super__.onStart.apply(this, arguments);

    if (this.walkableArea){
      this.walker = this.walkableArea.getWalker();
    }
  },

  onEnd: function() { },

  update: function(dt) {

    if (this.walker.targetReached){
      this.insertBehindMe(new Command(this.command));
    }

    if (!this.walker.walkingTo){
      this.isFinished = true;
    }

  },

});