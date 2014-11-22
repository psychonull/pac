
var Action = require('../Action');
var Point = require('../Point');
var Text = require('../Text');
var Speaker = require('./Speaker');

module.exports = Action.extend({

  requires: [Speaker],

  text: '',
  duration: 2,
  after: null,

  init: function(options) {
    this.text = (options && options.text) || this.text;
    this.duration = (options && options.duration) || this.duration;
    this.after = (options && options.after) || this.after;
  },

  onStart: function() {
    this.elapsed = 0;
    var owner = this.actions.owner;
    owner.speakerText.value = this.text;
  },

  onEnd: function() {
    var owner = this.actions.owner;
    owner.speakerText.value = '';
    if(this.after){
      this.after(this);
    }
  },

  update: function(dt) {
    this.elapsed += dt;
    if(this.elapsed >= this.duration){
      this.isFinished = true;
    }
  }

});