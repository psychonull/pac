
var EngineComponent = require('./EngineComponent');
var Cache = require('./Cache'),
  Texture = require('./Texture'),
  JsonFile = require('./JsonFile'),
  _ = require('./utils');

  // some inspiration:
  //http://www.goodboydigital.com/pixijs/docs/classes/AssetLoader.html
  //https://github.com/andrewrk/chem/blob/master/lib/resources.js
  //http://docs.phaser.io/Loader.js.html
  //http://docs.phaser.io/Cache.js.html

var Loader = EngineComponent.extend({

  // events: start, progress, complete
  // events(planned): start:group, progress:group, complete:group

  _resourcesToLoad: 0,
  _resourcesLoaded: 0,

  init: function(game, resources){
    this.game = game;
    if(!this.game.cache){
      // game cache will only contain loaded assets
      this.game.cache = new Cache();
    }

    this._initResourceCollections();
    this.addResources(resources);

    this.on('complete', this.overwriteGameCache);
  },

  _initResourceCollections: function(){
    _.forEach(this.getResourceTypes(), _.bind(function(resType){
        this[resType] = new Cache();
      }, this)
    );
  },

  getResourceTypes: function(){
    return _.keys(this.constructor.ResourceTypes);
  },

  addResource: function(name, filepath){
    var type, path;
    if(typeof filepath === 'string'){
      type = this.constructor.ResolveFileType(filepath);
      path = filepath;
    }
    else if(typeof filepath === 'object'){
      var options = filepath;
      type = options.type;
      path = options.path;
    }
    return this._addResource(name, path, type);
  },

  _addResource: function(name, filepath, type){
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

  getResources: function(){
    var types = this.getResourceTypes();
    var that = this;
    return _(types).map(function(type){
        return that[type].values();
      })
      .flatten()
      .value();
  },

  load: function(){
    this.emit('start');

    var that = this;
    var resources = this.getResources();
    this._resourcesToLoad = resources.length;

    _.forEach(resources, function(resource){
      resource.on('load', function(){
        that._resourcesLoaded++;
        var progress = that._resourcesLoaded / that._resourcesToLoad;
        if(progress >= 1){
          that.emit('complete');
        }
        else{
          that.emit('progress', progress);
        }
      });
      resource.load();
    });
  },

  overwriteGameCache: function(){
    _.forEach(this.getResourceTypes(), _.bind(function(type){
      var loadedForType = _.omit(this[type].get(), function(val){
        return val.loaded !== true;
      });
      this.game.cache[type] = new Cache(loadedForType);
    }, this));
  }
},
{
  // resourceType -> resourceConstructor
  ResourceTypes: {
    images: Texture,
    json: JsonFile
  },

  // filename -> resourceType
  ResolveFileType: function(fileName) {
    if (new RegExp(/^.+(\.png|\.jpg|\.jpeg)$/i).test(fileName)){
      return 'images';
    }
    if (new RegExp(/^.+(\.json)$/i).test(fileName)){
      return 'json';
    }
    throw new Error('File type not supported for ' + fileName);
  }
});

module.exports = Loader;
