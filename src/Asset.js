
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  url: null,
  loaded: false,
  error: null,

  init: function(options){
    if (typeof options === 'string'){
      this.url = options;
    }
    else if(typeof options === 'object'){
      this.url = options.url || options.path;
    }
  },

  load: function(){
    throw new Error('load: not implemented');
  },

  raw: function(){
    throw new Error('raw: not implemented. ' +
      'Expected to return the "usable" asset');
  },

  onload: function(){
    this.loaded = true;
    this.emit('load');
  },

  onerror: function(err){
    this.loaded = false;
    this.error = err || true;
    this.emit('error', err);
  }

});
