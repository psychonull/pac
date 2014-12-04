
var Emitter = require('./Emitter');
var GameObject = require('./GameObject');
var GameObjectList = require('./GameObjectList');

var Scene = module.exports = Emitter.extend({

  name: null,
  size: null,
  texture: null,

  objects: null,

  constructor: function(options){
    this.name = (options && options.name) || this.name;
    this.size = (options && options.size) || this.size;
    this.texture = (options && options.texture) || this.texture;

    this.objects = new GameObjectList();
    this.objects.on('add', this._initObject.bind(this));
    this.objects.on('remove', this._clearObject.bind(this));

    Emitter.apply(this, arguments);
  },

  _initObject: function(obj){
    obj.game = this.game;
    obj.scene = this;
  },

  _clearObject: function(obj){
    if (obj.scene === this){
      obj.scene = null;
    }
  },

  addObject: function(toAdd){
    this.objects.add(toAdd);
    return this;
  },

  removeObject: function(toRemove){
    this.objects.remove(toRemove);
    return this;
  },

  findOne: function(search){
    return this.objects.findOne(search);
  },

  find: function(search){
    return this.objects.find(search);
  },

  clear: function(){
    this.objects
      .each(this._clearObject.bind(this))
      .clear();
  },

  _update: function(dt){
    this.objects.update(dt);
    this.update(dt);
  },

  // Methods to implement Custom behaviors
  init: function(options){},
  onEnter: function(sceneFrom){},
  onExit: function(sceneTo){},
  update: function(dt){ },

});
