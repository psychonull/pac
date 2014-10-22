
var Emitter = require('./Emitter'),
  Scenes = require('./Scenes');

var componentTypes = ['renderer', 'loader'];

var Game = module.exports = Emitter.extend({

  scenes: null,

  // Components
  renderer: null,
  loader: null,

  start: function(){
    this.scenes = new Scenes();
  },

  use: function(type, Component){
    if (componentTypes.indexOf(type) === -1){
      throw new Error('Component type "' + type + '" not valid');
    }

    this[type] = new Component();
  }

}, {

  create: function(){
    return new Game();
  }

});
