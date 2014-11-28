
var Action = require('../Action');
var Point = require('../Point');
var Text = require('../Text');
var Speaker = require('./Speaker');

module.exports = Action.extend({

  name: 'Speak',

  requires: [Speaker],

  text: '',
  duration: 2,
  after: null,

  init: function(options) {
    this.text = (options && options.text) || this.text;
    this.duration = (options && options.duration) || this.duration;
    this.after = (options && options.after) || this.after;
    this.duration += this.text.length * 0.05;
  },

  onStart: function() {
    this.elapsed = 0;
    var owner = this.actions.owner;
    owner.speakerText.value = this.text;
    if(owner.speakerText.wordWrap && !owner.speakerText.avoidAutoWrap){
      if(this.text.length < 50){
        owner.speakerText.wordWrap = 120;
      }
      else if(this.text.length < 100 ){
        owner.speakerText.wordWrap = 170;
      }
      else{
        owner.speakerText.wordWrap = 220;
      }
    }
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
    if(this.elapsed >= this.duration ||
        (this.actions.owner.game.inputs.cursor.isDown && this.elapsed > 1)){
      this.isFinished = true;
    }
  }

});
