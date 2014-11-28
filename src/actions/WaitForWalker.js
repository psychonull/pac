var Action = require('../Action');

module.exports = Action.extend({

  name: 'WaitForWalker',

  init: function(options){
    this.isBlocking = true;
    this.walker = options.walker;
  },

  onStart: function() {
    this.walkStopListener = this._onWalkStop.bind(this);
    this.walker.on('walk:stop', this.walkStopListener);
  },

  _onWalkStop: function(targetReached){
    /*
    if (!targetReached) {
      //TODO: cancel following command if any
    }
    */

    this.isFinished = true;
  },

  onEnd: function() {
    this.walker.removeListener('walk:stop', this.walkStopListener);
    this.walker = null;
  },

  update: function(dt) { }

});