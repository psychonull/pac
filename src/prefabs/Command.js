
var Text = require('../Text');

module.exports = Text.extend({

  constructor: function(options){
    this.command = (options && options.command) || this.command;

    Text.apply(this, arguments);
  },

});
