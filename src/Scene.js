
var Emitter = require('./Emitter');
var GameObject = require('./GameObject');
var GameObjectList = require('./GameObjectList');

var required = ['name', 'size'];

var Scene = module.exports = Emitter.extend({

  name: null,
  size: null,
  texture: null,

  objects: null,

  constructor: function(options){
    this.name = (options && options.name) || this.name;
    this.size = (options && options.size) || this.size;
    this.texture = (options && options.texture) || this.texture;

    required.forEach(function(req){

      if (!this[req]) {
        throw new Error('Cannot create scene ' + (this.name || '') +
          ': "' + req + '" is required');
      }

    }, this);

    this.objects = new GameObjectList();

    var self = this;
    this.objects.on('add', function(obj){
      obj.scene = self;

      if (self.game){
        obj.game = self.game;
      }
    });

    Emitter.apply(this, arguments);
  },

  setGame: function(game){
    this.game = game;

    this.objects.each(function(obj){
      obj.game = game;
    });
  },

  init: function(){},

  onEnter: function(sceneFrom){},

  onLeave: function(){},

  addObject: function(toAdd){
    this.objects.add(toAdd);
  },

  findObject: function(search){
    return this.objects.find(search);
  },

  update: function(dt){

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
  }

});
