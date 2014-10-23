
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

  use: function(type, Component, options){

    if (componentTypes.indexOf(type) === -1){
      throw new Error('The type "' + type + '" is not allowed.');
    }

    if (!Component){
      throw new Error('Expected a "' + type + '" Component.');
    }

    switch(type){
      case 'renderer': this._attachRenderer(Component, options);
    }

    return this;
  },

  _attachRenderer: function(Renderer, options){
    var instance = new Renderer(options);

    if (!(instance instanceof EngineComponents.Renderer)){
      throw new Error('Type of "renderer" must inherit from pac.Renderer');
    }

    this.renderer = instance;
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

  update: function(dt){
    this.emit('update', dt);
  },

  draw: function(){
    this.renderer.render();
    this.emit('draw');
  },

}, {

  create: function(options){
    return new Game(options);
  }

});
