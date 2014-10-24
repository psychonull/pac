
var ClassExtend = require('./ClassExtend');

module.exports = ClassExtend.extend({

  constructor: function(){
    if (this.init){
      this.init.apply(this, arguments);
    }
  },

  init: function(){ }

});
