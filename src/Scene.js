
var Emitter = require('./Emitter');
var GameObject = require('./GameObject');
var GameObjectList = require('./GameObjectList');

var required = ['name', 'size'];

var Scene = module.exports = Emitter.extend({

  name: null,
  size: null,
  objects: null,

  constructor: function(options){
    this.name = (options && options.name) || this.name;
    this.size = (options && options.size) || this.size;

    required.forEach(function(req){

      if (!this[req]) {
        throw new Error('Cannot create scene ' + (this.name || '') +
          ': "' + req + '" is required');
      }

    }, this);

    this.objects = new GameObjectList();

    //Scene.__super__.constructor.apply(this, arguments);
    Emitter.apply(this, arguments);
  },

  init: function(){},

  onEnter: function(sceneFrom){},

  onLeave: function(){},

  addObject: function(toAdd){
    this.objects.add(toAdd);
  },

  update: function(dt){

    this.objects.each(function(gameObject){
      gameObject.updateActions(dt);
      gameObject.update(dt);
    });
    
  }

});
