
var Asset = require('./Asset');
var List = require('./List');
var MapList = require('./MapList');
var JsonFile = require('./JsonFile');
var _ = require('./utils');

module.exports = Asset.extend({

  image: null,
  frames: null,
  atlas: null,
  _imageLoaded: false,

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

  setAtlas: function(jsonFile){
    if(!(jsonFile instanceof JsonFile)){
      throw new Error('Invalid atlas type: ' + jsonFile.constructor.name);
    }
    this.atlas = jsonFile;
    if(this.atlas.loaded){
      this.setFrames(this.atlas.raw().frames);
      this.loaded = this._imageLoaded;
    }
    else {
      this.loaded = false;
      this.atlas.on('load', _.bind(function(){
        this.setFrames(this.atlas.raw().frames);
        this.loaded = this._imageLoaded;
      }, this));
    }
  },

  onload: function(){
    this.constructor.__super__.onload.call(this);
    this._imageLoaded = true;
    if(this.atlas && !this.atlas.loaded){
      this.loaded = false;
    }
  },

  load: function(){
    this.image.src = this.url;
  },

  raw: function(){
    return this.loaded ? this.image : null;
  }

});
