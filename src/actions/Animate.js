
var Action = require('../Action');

module.exports = Action.extend({

  name: 'Animate',

  init: function(){
    var arg0 = arguments[0];

    var animationName;
    var blocking;

    if (typeof arg0 === 'object'){
      animationName = arg0.animationName;
      blocking = arg0.blocking;
    }
    else {
      animationName = arg0;
      blocking = arguments[1];
    }

    this.animationName = animationName;

    if (!this.animationName){
      throw new Error('Animate Action expected an animation name');
    }

    this.isBlocking =
      (blocking === false && false) ||
      (blocking === true && true) || this.isBlocking || false;
  },

  onStart: function() {
    var owner = this.actions.owner;

    if (!owner.animations){
      throw new Error('Animate Action requires [animations] on the Object');
    }

    if (!owner.animations.get(this.animationName)){
      throw new Error('Animate Action animation [' +
        this.animationName + '] not found');
    }

    this.startAnimation();
  },

  startAnimation: function(){
    var owner = this.actions.owner;

    this.animation = owner.animations.get(this.animationName);

    if (this.isBlocking){
      this.__finishMe = this._finishMe.bind(this);
      this.animation.on('end', this.__finishMe);
    }
    else {
      this._finishMe();
    }

    owner.animations.play(this.animationName);
  },

  _finishMe: function(){
    this.isFinished = true;

    if (this.__finishMe){
      this.animation.removeListener('end', this.__finishMe);
    }
  },

  onEnd: function() { },

  update: function(dt) { }

});