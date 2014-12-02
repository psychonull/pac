
var Action = require('../Action');

module.exports = Action.extend({

  name: 'Execute',

  init: function(){
    var arg0 = arguments[0];

    var callback;

    if (typeof arg0 === 'object'){
      callback = arg0.callback;
    }
    else {
      callback = arg0;
    }

    this.callback = callback;
    this.isBlocking = false;
  },

  onStart: function() { },

  onEnd: function() { },

  update: function(dt) {
    var owner = this.actions.owner;
    var response = this.callback.call(owner, dt, this);

    if (response === true){
      this.isFinished = true;
    }
  }

});