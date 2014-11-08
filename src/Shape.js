
var Drawable = require('./Drawable');

module.exports = Drawable.extend({

  fill: null,
  stroke: null,
  lineWidth: 1,

  constructor: function(options){
    this.fill = (options && options.fill) || this.fill;
    this.stroke = (options && options.stroke) || this.stroke;
    this.lineWidth = (options && options.lineWidth) || this.lineWidth;

    Drawable.apply(this, arguments);
  },

});
