
var Shape = require('./Shape');

module.exports = Shape.extend({

  radius: 50,

  constructor: function(options){
    this.radius = (options && options.radius) || this.radius;
    Shape.apply(this, arguments);
  },

});
