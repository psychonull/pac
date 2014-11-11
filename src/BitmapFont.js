
var Asset = require('./Asset');
var JsonFile = require('./JsonFile');
var Texture = require('./Texture');
var _ = require('./utils');

module.exports = Asset.extend({

  textureAsset: null,
  definitionAsset: null,

  init: function(options){

    this.constructor.__super__.init.call(this, options);

    if(typeof options !== 'object'){
      throw new Error('Missing options');
    }
    if(!options.texture){
      throw new Error('Missing texture');
    }
    if(!options.definition){
      throw new Error('Missing definition');
    }

    this.textureAsset = new Texture(options.texture);
    this.definitionAsset = new JsonFile(options.definition);

    this.textureAsset.on('error', _.bind(this.onerror, this));
    this.definitionAsset.on('error', _.bind(this.onerror, this));
    this.textureAsset.on('load', _.bind(this._oneLoaded, this));
    this.definitionAsset.on('load', _.bind(this._oneLoaded, this));
  },

  _oneLoaded: function(){
    if(this.textureAsset.loaded && this.definitionAsset.loaded){
      this.onload();
    }
  },

  load: function(){
    this.textureAsset.load();
    this.definitionAsset.load();
  },

  raw: function(){
    return {
      texture: this.textureAsset.raw(),
      definition: this.definitionAsset.raw()
    };
  }

});
