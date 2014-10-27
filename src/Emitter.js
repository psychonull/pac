
var Base = require('./Base');
var EventEmitter = require('events').EventEmitter;
var _ = require('./utils');

var Emitter = module.exports = Base.extend({

  cid: null,

  constructor: function(){
    EventEmitter.call(this);

    this.cid = _.uniqueId();

    if (this.init){
      this.init.apply(this, arguments);
    }
  },

  init: function(){ }

});

Emitter.prototype = Object.create(EventEmitter.prototype);
