
var Emitter = require('./Emitter');
var GameObject = require('./GameObject');

var required = ['name', 'size'];

module.exports = Emitter.extend({

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

    this.objects = [];
  },

  add: function(){
    var arg0 = arguments[0];

    if(Array.isArray(arg0)){

      arg0.forEach(function(obj){
        this._addOne(obj);
      }, this);

    }
    else {
      this._addOne(arg0);
    }

    return this;
  },

  _addOne: function(obj){

    if (obj instanceof GameObject){
      this.objects.push(obj);
      return;
    }

    throw new Error('Only pac.GameObjects are allowed to add into an Scene');
  },

  update: function(dt){

    this.objects.forEach(function(gameObject){
      gameObject.update(dt);
    });
    
  }

});
