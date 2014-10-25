
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  url: null,
  loaded: false,
  image: null,

  init: function(options){
    if (!options){
      throw new Error('Expected an URL, image object or a base64');
    }

    this.image = new Image();
    this.image.onload = this.onload.bind(this);
    this.image.onerror = this.onerror.bind(this);
    this.lodaded = false;

    if (typeof options === 'string'){
      this.url = options;
      this.image.src = this.url;
    }
  },

  onload: function(){
    this.loaded = true;
    this.emit('load');
  },

  onerror: function(){
    this.loaded = false;
    this.emit('error');
  }

});
