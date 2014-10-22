
var Base = require('class-extend');

module.exports = Base.extend({

  constructor: function(){
    if (this.start){
      this.start.apply(this, arguments);
    }
  },

  start: function(){ }

});