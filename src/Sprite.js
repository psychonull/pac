
var Drawable = require('./Drawable');
var Point = require('./Point');

var Sprite = module.exports = Drawable.extend({

  position: null,
  size: null,
  texture: null,

  constructor: function(options){
    this.texture = (options && options.texture) || this.texture;
    
    if (!this.texture){
      throw new Error('Expected [texture] name of Sprite');
    }

    this.size = (options && options.size) || this.size;

    Sprite.__super__.constructor.apply(this, arguments);
  },

  init: function(){ },

  update: function() { }

});

