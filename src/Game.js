
var Gameloop = require('gameloop'),
  Scenes = require('./Scenes');

var componentTypes = ['renderer'];

var EngineComponents = {
  Renderer: require('./Renderer')
};

Gameloop.extend = require('class-extend').extend;

var Game = module.exports = Gameloop.extend({

  constructor: function(){
    // call constructor of Gameloop
    Game.__super__.constructor.apply(this, arguments);

    // Engine Components
    this.renderer = null;

    // Public members    
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
  },

  
  start: function(){
    Game.__super__.start.apply(this, arguments);
  },

  pause: function(){
    Game.__super__.pause.apply(this, arguments);
  },

  resume: function(){
    Game.__super__.resume.apply(this, arguments);
  },

  end: function(){
    Game.__super__.end.apply(this, arguments);
  },

  update: function(){
    Game.__super__.update.apply(this, arguments);
  },

  draw: function(){
    Game.__super__.draw.apply(this, arguments);
  },

}, {

  create: function(options){
    return new Game(options);
  }

});
