
var Base = require('./Base');
var EventEmitter = require('events').EventEmitter;

var Emitter = module.exports = Base.extend({

  constructor: function(){
    EventEmitter.call(this);
    
    if (this.start){
      this.start.apply(this, arguments);
    }
  },

  start: function(){ }

});

Emitter.prototype = Object.create(EventEmitter.prototype);
