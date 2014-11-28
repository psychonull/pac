
var Action = require('../Action');

module.exports = Action.extend({

  name: 'Delay',

  init: function(duration){
    this.isBlocking = true;

    this.duration = duration || 2;
    this.elapsed = 0;
  },

  onStart: function() {
    this.elapsed = 0;
  },

  onEnd: function() { },

  update: function(dt) {
    this.elapsed += dt;
    if(this.elapsed >= this.duration){
      this.isFinished = true;
    }
  }

});