
var Asset = require('./Asset');
var List = require('./List');
var MapList = require('./MapList');
var _ = require('./utils');

module.exports = Asset.extend({

  image: null,
  frames: null,

  init: function(options){

    this.constructor.__super__.init.call(this, options);

    if(!this.url){
      throw new Error('Expected an URL, image object or a base64');
    }

    this.image = new Image();
    this.image.onload = this.onload.bind(this);
    this.image.onerror = this.onerror.bind(this);

    if (options && options.frames){
      this.setFrames(options.frames);
    }
  },

  setFrames: function(frames){
    if(_.isArray(frames)){
      this.frames = new List(frames);
    }
    else {
      this.frames = new MapList(frames);
    }
  },

  load: function(){
    this.image.src = this.url;
  },

  raw: function(){
    return this.loaded ? this.image : null;
  }

});
