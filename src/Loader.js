
var EngineComponent = require('./EngineComponent');
var Cache = require('./Cache'),
  Texture = require('./Texture'),
  _ = require('./utils');

  // some inspiration:
  //http://www.goodboydigital.com/pixijs/docs/classes/AssetLoader.html
  //https://github.com/andrewrk/chem/blob/master/lib/resources.js
  //http://docs.phaser.io/Loader.js.html
  //http://docs.phaser.io/Cache.js.html

var Loader = EngineComponent.extend({

  // events: start, progress, complete
  // events(planned): start:group, progress:group, complete:group
  init: function(game, resources){
    this.game = game;
    if(!this.game.cache){
      // game cache will only contain loaded assets
      this.game.cache = new Cache();
    }

    this._initResourceCollections();
    this.addResources(resources);
  },

  _initResourceCollections: function(){
    _.chain(this.constructor.ResourceTypes).keys().forEach(
      _.bind(function(resType){
        this[resType] = new Cache();
      }, this)
    );
  },

  addResource: function(name, filepath){
    var type = this.constructor.ResolveFileType(filepath);
    var Constructor = this.constructor.ResourceTypes[type];
    if(!Constructor){
      throw new Error('No type mapping for: ' + type);
    }
    var instance = new Constructor(filepath);
    this[type].add(name, instance);
    return instance;
  },

  addResources: function(obj){
    _.forIn(obj, _.bind(function(val, key){
      this.addResource(key, val);
    }, this));
  },

  load: function(){
    this.emit('start');
  }
},
{
  // resourceType -> resourceConstructor
  ResourceTypes: {
    images: Texture
  },

  // filename -> resourceType
  ResolveFileType: function(fileName) {
    if (new RegExp(/^.+(\.png|\.jpg|\.jpeg)$/i).test(fileName)){
      return 'images';
    }
    throw new Error('File type not supported for ' + fileName);
  }
});

module.exports = Loader;
