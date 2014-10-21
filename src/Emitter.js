
var Base = require('./Base');
var EventEmitter = require('events').EventEmitter;

var Emitter = module.exports = Base.extend({

  start: function(){
    EventEmitter.call(this);
  }

});

Emitter.prototype = Object.create(EventEmitter.prototype);
