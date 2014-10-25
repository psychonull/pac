
var Drawable = require('./Drawable');
var Point = require('./Point');

var Sprite = module.exports = Drawable.extend({

  position: null,
  size: null,

  init: function(options){
    Sprite.__super__.init.apply(this, arguments);

    if (!options || (options && !options.texture)){
      throw new Error('Expected [texture] name of Sprite');
    }

    this.size = (options && options.size) || null;
  },

  update: function() { }

});

