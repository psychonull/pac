
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  isFinished: false,
  isBlocking: false,
  actions: null,

  init: function() { },

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) {
    throw new Error('Must override action.update()');
  },

  insertInFrontOfMe: function(action) {
    this.actions.insertBefore(action, this);
  },

  insertBehindMe: function(action) {
    this.actions.insertAfter(action, this);
  },

});