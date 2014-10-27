
var ClassExtend = require('./ClassExtend');
var _ = require('./utils');

module.exports = ClassExtend.extend({

  cid: null,

  constructor: function(){
    this.cid = _.uniqueId();
    
    if (this.init){
      this.init.apply(this, arguments);
    }
  },

  init: function(){ }

});
