
var Shape = require('./Shape');

module.exports = Shape.extend({

  size: { width: 50, height: 50 },

  constructor: function(options){
    this.size = (options && options.size) || this.size;
    Shape.apply(this, arguments);
  },

});
