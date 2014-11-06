
var Drawable = require('./Drawable');
var Point = require('./Point');

var Sprite = module.exports = Drawable.extend({

  position: null,
  size: null,
  texture: null,

  frame: null,
  animations: null,

  constructor: function(options){
    this.texture = (options && options.texture) || this.texture;
    
    if (!this.texture){
      throw new Error('Expected [texture] name of Sprite');
    }

    this.size = (options && options.size) || this.size;
    this.frame = (options && options.frame) || this.frame;

    if (options && options.animations){
      this.animations = options.animations;
      this.animations.owner = this;
    }

    Drawable.apply(this, arguments);
  },

  init: function(){ },

  update: function(dt) { },

  updateAnimations: function(dt) {
    if (this.animations){
      this.animations.update(dt);
      this.frame = this.animations.current.frame;
    }
  }

});

