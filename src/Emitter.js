
var Base = require('./Base');
var EventEmitter = require('events').EventEmitter;

var Emitter = module.exports = Base.extend({

  constructor: function(){
    EventEmitter.call(this);
    this.start();
  },

  start: function(){ }

});

Emitter.prototype = Object.create(EventEmitter.prototype);
