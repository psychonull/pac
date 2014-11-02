
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  isFinished: false,
  isBlocking: false,
  actionList: null,

  init: function() { },

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) {
    throw new Error('Must override action.update()');
  },

  insertInFrontOfMe: function(action) {
    this.actionList.insertBefore(action, this);
  },

  insertBehindMe: function(action) {
    this.actionList.insertAfter(action, this);
  },

});