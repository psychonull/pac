
var Base = require('./Base');
var EventEmitter = require('events').EventEmitter;

var Emitter = module.exports = Base.extend({

  constructor: function(){
    EventEmitter.call(this);
    Emitter.__super__.constructor.apply(this, arguments);
  },

  init: function(){ }

});

Emitter.prototype = Object.create(EventEmitter.prototype);
