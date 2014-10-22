
var Emitter = require('./Emitter');

var componentTypes = ['renderer', 'loader'];

var Game = module.exports = Emitter.extend({

  // Components
  renderer: null,
  loader: null,

  start: function(){

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
