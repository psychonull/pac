
var Action = require('../Action');
var Point = require('../Point');
var Text = require('../Text');
var Speaker = require('./Speaker');
var _ = require('../utils');

module.exports = Action.extend({

  name: 'Speak',

  requires: [Speaker],

  text: '',
  duration: 2,
  minDuration: 1,
  after: null,

  init: function(options) {
    _.extend(this,
      _.pick(options, ['text', 'duration', 'minDuration',
            'after', 'durationOffsetFn', 'wordWrapCorrectionFn'])
            );

    this.duration += this.durationOffsetFn(this.text);
  },

  onStart: function() {
    this.elapsed = 0;
    var owner = this.actions.owner;
    owner.speakerText.value = this.text;
    this.wordWrapCorrectionFn(owner.speakerText);
  },

  onEnd: function() {
    var owner = this.actions.owner;
    owner.speakerText.value = '';
    if(this.after){
      this.after(this);
    }
  },

  durationOffsetFn: function(textValue){
    return 0;
  },

  wordWrapCorrectionFn: function(text){
    return;
  },

  update: function(dt) {
    this.elapsed += dt;
    if(this.elapsed >= this.duration ||
      (this.actions.owner.game.inputs.cursor.isDown &&
          this.elapsed > this.minDuration)){
      this.isFinished = true;
    }
  }

});
