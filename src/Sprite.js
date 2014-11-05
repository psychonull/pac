
var Drawable = require('./Drawable');
var Point = require('./Point');

var Sprite = module.exports = Drawable.extend({

  position: null,
  size: null,
  texture: null,

  animations: null,

  constructor: function(options){
    this.texture = (options && options.texture) || this.texture;
    
    if (!this.texture){
      throw new Error('Expected [texture] name of Sprite');
    }

    this.size = (options && options.size) || this.size;

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
    }
  }

});

