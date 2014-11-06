
var GameObject = require('./GameObject');
var Point = require('./Point');

var Drawable = module.exports = GameObject.extend({

  position: null,
  
  layer: null,
  zIndex: 0,

  constructor: function(opts){
    this.position = (opts && opts.position) || this.position || new Point();
    this.position = new Point(this.position);

    this.layer = (opts && opts.layer) || this.layer;
    this.zIndex = (opts && opts.zIndex) || this.zIndex;

    GameObject.apply(this, arguments);
  },

  init: function(){ },

  update: function() { }

});

