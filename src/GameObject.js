
var Emitter = require('./Emitter');
var ActionList = require('./ActionList');

var GameObject = module.exports = Emitter.extend({

  constructor: function(options){
    //GameObject.__super__.constructor.apply(this, arguments);
    Emitter.apply(this, arguments);
  },

  init: function(){ },

  update: function() { }

});

