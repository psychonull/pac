
var Drawable = require('./Drawable');
var Point = require('./Point');
var Rectangle = require('./Rectangle');

var Sprite = module.exports = Drawable.extend({

  name: 'Sprite',
  position: null,
  size: null,
  texture: null,

  frame: null,
  animations: null,
  shape: null,

  constructor: function(options){
    this.texture = (options && options.texture) || this.texture;

    if (!this.texture){
      throw new Error('Expected [texture] name of Sprite');
    }

    this.size = (options && options.size) || this.size;
    this.frame = (options && options.frame) || this.frame;

    this._createHitBox(options);
    this._initAnimations(options);

    Drawable.apply(this, arguments);
  },

  _createHitBox: function(options){
    this.shape = (options && options.shape) || this.shape;

    if (this.shape === true){
      if (!this.size){
        throw new Error('Cannot create a shape for this Sprite without a size');
      }

      this.shape = new Rectangle({
        position: new Point(),
        size: this.size
      });

      if (options){
        options.shape = this.shape;
      }
    }
  },

  _initAnimations: function(options){
    if (options && options.animations){
      this.animations = options.animations;
      this.animations.owner = this;
    }
  },

  init: function(){ },

  update: function(dt) { },

  updateAnimations: function(dt) {
    if (this.animations){

      this.animations.update(dt);

      if (this.animations.current){
        this.frame = this.animations.current.frame;
      }
    }
  }

});

