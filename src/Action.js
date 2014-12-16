
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
          this.insertAbove(new Action());
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
  update: function(dt) { },

  block: function(){
    this.isBlocking = true;
  },

  blockOnce: function(){
    this.isBlocking = true;
    this.blockOnce = true;
  },

  unblock: function(){
    this.isBlocking = false;
  },

  insertAbove: function(action) {
    if (!this.actions) return;

    var idx = this.index();
    this.actions.insertAt(idx, action);
    return this;
  },

  insertBelow: function(action) {
    if (!this.actions) return;

    var idx = this.index();
    var max = this.actions.length-1;

    if (idx >= max){
      this.actions.add(action);
      return this;
    }

    this.actions.insertAt(idx+1, action);
    return this;
  },

  moveUp: function(){
    this.moveTo(this.index() - 1);
    return this;
  },

  moveDown: function(){
    this.moveTo(this.index() + 1);
    return this;
  },

  moveTop: function(){
    this.moveTo(0);
    return this;
  },

  moveBottom: function(){
    if (this.actions){
      this.moveTo(this.actions.length-1);
    }

    return this;
  },

  moveTo: function(index){
    var idx = this.index();

    if (idx === -1 || idx === index){
      // This action isn't on a list
      // or is at same position of request index
      return this;
    }

    if (index < 0 || index >= this.actions.length){
      // The requested index is out bounds
      return this;
    }

    this.actions.move(this, index);
    return this;
  },

  index: function(){
    if (this.actions){
      return this.actions.indexOf(this);
    }

    return -1;
  },

  remove: function(){
    if (this.actions){
      this.actions.remove(this);
    }
  }

});