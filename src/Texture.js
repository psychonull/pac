
var Asset = require('./Asset');

module.exports = Asset.extend({

  image: null,

  init: function(options){

    this.constructor.__super__.init.call(this, options);

    if(!this.url){
      throw new Error('Expected an URL, image object or a base64');
    }

    this.image = new Image();
    this.image.onload = this.onload.bind(this);
    this.image.onerror = this.onerror.bind(this);

  },

  load: function(){
    this.image.src = this.url;
  },

  raw: function(){
    return this.loaded ? this.image : null;
  }

});
