
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  times: 0,
  frames: [],
  fps: 60,

  init: function(options) {
    this.times = (options && options.times) || this.times;
    this.frames = (options && options.frames) || this.frames || [];
    this.fps = (options && options.fps) || this.fps || 60;

    this.step = 1/this.fps;

    this.isPaused = false;
    this.isRunning = false;
    this.runTimes = 0;
    this.started = false;
    
    this.frameIndex = 0;
    this.frame = this.frames[this.frameIndex];

    this.reset();
  },

  reset: function(){
    this.accumulator = 0.0;
    this.isPaused = false;

    this.runTimes = 0;
    this.frameIndex = 0;
    this.frame = this.frames[this.frameIndex];
    this.isRunning = false;
    this.started = false;
  },

  play: function(){
    if (this.isPaused){
      this.resume();
      return;
    }

    this.reset();
    this.isRunning = true;
    this.emit('play');
  },

  stop: function(){
    this.isPaused = false;
    this.isRunning = false;
    this.emit('stop');
  },

  pause: function(){
    this.isPaused = true;
    this.isRunning = false;
    this.emit('pause');
  },

  resume: function(){
    if (this.isPaused){
      this.isPaused = false;
      this.isRunning = true;
      this.emit('resume');
      return;
    }
    
    this.start();
  },

  update: function(dt){

    if (this.isRunning && !this.isPaused){
    
      if (!this.started){
        this.started = true;
        this.emit('start');
        return;
      }

      this.accumulator += dt;

      while(this.accumulator >= this.step) {
        this._moveFrame();
        this.accumulator -= this.step;
      }
    }

  },

  _moveFrame: function(){
    this.frameIndex++;

    if (this.frameIndex > this.frames.length-1){
      this.frameIndex = 0;
    }

    this.frame = this.frames[this.frameIndex];
    this.emit('frame', this.frame, this.frameIndex);

    if (this.frameIndex === this.frames.length-1){
      this.runTimes++;

      if (this.times > 0 && this.runTimes === this.times){
        this.stop();
        this.emit('end');
      }
    }
  }

});