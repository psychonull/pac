
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  name: 'Action',

  isFinished: false,
  isBlocking: false,
  actions: null,
  requires: null,

  resolve: function(){
    if (this.requires && this.requires.length > 0){
      var createdOne = false;

      this.requires.forEach(function(Action){

        if (!this.actions.has(Action)){
          this.insertInFrontOfMe(new Action());
          createdOne = true;
        }
      }, this);

      return !createdOne;
    }

    return true;
  },

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