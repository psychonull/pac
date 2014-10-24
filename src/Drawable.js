
var GameObject = require('./GameObject');
var Point = require('./Point');

module.exports = GameObject.extend({

  position: null,

  init: function(options){
    this.position = (options && options.position) || new Point();
  },

  update: function() { }

});

