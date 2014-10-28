
var Emitter = require('./Emitter');
var GameObject = require('./GameObject');
var GameObjectList = require('./GameObjectList');

var required = ['name', 'size'];

module.exports = Emitter.extend({

  idAttribute: 'name',

  name: null,
  size: null,

  objects: null,

  init: function(options){

    if (!options){
      throw new Error('Cannot create an empty Scene: required ' +
        required.join(', '));
    }

    required.forEach(function(req){

      if (!options.hasOwnProperty(req)) {
        throw new Error('Cannot create scene ' + (this.name || '') +
          ': "' + req + '" is required');
      }

      this[req] = options[req];

    }, this);

    this.objects = new GameObjectList();
  },

  addObject: function(toAdd){
    this.objects.add(toAdd);
  },

  update: function(dt){

    this.objects.each(function(gameObject){
      gameObject.update(dt);
    });
    
  }

});
