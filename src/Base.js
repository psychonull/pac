
var Base = require('class-extend');

module.exports = Base.extend({

  constructor: function(){
    if (this.init){
      this.init.apply(this, arguments);
    }
  },

  init: function(){ }

});
