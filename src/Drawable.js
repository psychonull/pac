
var GameObject = require('./GameObject');
var Point = require('./Point');

var Drawable = module.exports = GameObject.extend({

  position: null,

  constructor: function(opts){
    this.position = (opts && opts.position) || this.position || new Point();
    this.position = new Point(this.position);

    Drawable.__super__.constructor.apply(this, arguments);
  },

  init: function(){ },

  update: function() { }

});

