
var Action = require('../Action');
var _ = require('../utils');
var TWEEN = require('tween.js');

module.exports = Action.extend({

  name: 'Tween',

  field: null,
  to: null,
  duration: 1,
  easing: 'Linear.None',

  delay: 0,
  repeat: 0,
  yoyo: false,

  init: function(){

    this._init.apply(this, arguments);

    if (!this.to || (this.to && _.keys(this.to).length === 0)){
      throw new Error('Tween Action: Expected [to] parameter');
    }

    if (typeof this.easing === 'string'){
      this.easing = this.getEasing(this.easing);
    }
  },

  _init: function(){
    var arg0 = arguments[0];

    if (typeof arg0 === 'object' && arguments.length === 1){
      // by options object

      _.extend(this, _.pick(arg0 || {}, [
        'field',
        'to',
        'duration',
        'easing',
        'delay',
        'repeat',
        'yoyo',
        'isBlocking'
      ]));
    }
    else {
      // by parameters

      var idx = 0;
      if (typeof arg0 === 'string'){
        this.field = arg0;
        idx = 1;
      }

      this.to = arguments[idx];
      this.duration = arguments[++idx] || this.duration;
      this.easing = arguments[++idx] || this.easing;
    }

  },

  getEasing: function(easingStr){
    var props = easingStr.split('.');
    return TWEEN.Easing[props[0]][props[1]];
  },

  onStart: function() {
    var owner = this.actions.owner;

    this.tweenedObj = owner;
    if (this.field){
      this.tweenedObj = owner[this.field];
    }

    this.tween =
      new TWEEN.Tween(this.tweenedObj)
      .to(this.to, this.duration*1000)
      .easing(this.easing);

    this.configureTween();

    var self = this;
    this.tween.onComplete(function(){
      self.isFinished = true;
    });

    this.tween.start(0); // MUST call with 0 to be synched with update.
    this.dtAccum = 0;
  },

  configureTween: function(){
    if (this.delay){
      this.tween.delay(this.delay*1000);
    }

    if (this.repeat){
      var repeat = (this.repeat === true ? Infinity : this.repeat);
      this.tween.repeat(repeat);
    }

    if (this.yoyo){

      if (!this.repeat){
        // TWEEN needs a repeat > 0 to do a yoyo
        this.tween.repeat(1);
      }

      this.tween.yoyo(true);
    }
  },

  onEnd: function() {
    TWEEN.remove(this.tween);
  },

  update: function(dt) {
    this.dtAccum += dt;
    this.tween.update(this.dtAccum * 1000);
  }

});