
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

    Emitter.apply(this, arguments);
  },

  _initObject: function(obj){
    obj.game = this.game;
    obj.scene = this;
  },

  addObject: function(toAdd){
    this.objects.add(toAdd);
  },

  findObject: function(search){
    return this.objects.findOne(search);
  },

  findObjects: function(search){
    return this.objects.find(search);
  },

  _update: function(dt){

    this.objects.each(function(gameObject){

      if (gameObject.updateHierarchy){
        gameObject.updateHierarchy(dt);
      }

      gameObject.updateActions(dt);
      gameObject.update(dt);

      if (gameObject.updateAnimations){
        gameObject.updateAnimations(dt);
      }

    });

    this.update(dt);
  },

  // Methods to implement Custom behaviors
  init: function(options){},
  onEnter: function(sceneFrom){},
  onExit: function(sceneTo){},
  update: function(dt){ },

});
