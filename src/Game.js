
var Emitter = require('./Emitter'),
  Scenes = require('./Scenes');

var componentTypes = ['renderer'];

var EngineComponents = {
  Renderer: require('./Renderer')
};

var Game = module.exports = Emitter.extend({

  // Public members
  scenes: null,

  // Engine Components
  renderer: null,

  init: function(){
    this.scenes = new Scenes();
  },

  use: function(type, Component){

    if (componentTypes.indexOf(type) === -1){
      throw new Error('The type "' + type + '" is not allowed.');
    }

    if (!Component){
      throw new Error('Expected a "' + type + '" Component.');
    }

    switch(type){
      case 'renderer': this._attachRenderer(Component);
    }

    return this;
  },

  _attachRenderer: function(Renderer){
    var instance = new Renderer();

    if (!(instance instanceof EngineComponents.Renderer)){
      throw new Error('Type of "renderer" must inherit from pac.Renderer');
    }

    this.renderer = instance;
    
    // TODO: renderer specific initialization

  }

}, {

  create: function(){
    return new Game();
  }

});
