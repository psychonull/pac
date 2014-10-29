
var ClassExtend = require('./ClassExtend'),
  Gameloop = require('gameloop'),
  Scenes = require('./Scenes');

var componentTypes = ['renderer', 'loader'];

var EngineComponents = {
  Renderer: require('./Renderer'),
  Loader: require('./Loader')
};

Gameloop.extend = ClassExtend.extend;

var Game = module.exports = Gameloop.extend({

  constructor: function(){
    // call constructor of Gameloop
    Game.__super__.constructor.apply(this, arguments);

    // Engine Components
    this.renderer = null;
    this.loader = null;

    // Public members
    this.scenes = new Scenes();
    this.scenes.on('leave', this.onLeaveScene.bind(this));
    this.scenes.on('enter', this.onEnterScene.bind(this));

    // Private members
    this.assetsLoaded = false;
  },

  use: function(type, Component, options){

    if (componentTypes.indexOf(type) === -1){
      throw new Error('The type "' + type + '" is not allowed.');
    }

    if (!Component){
      throw new Error('Expected a "' + type + '" Component.');
    }

    switch(type){
      case 'renderer': this._attachRenderer(Component, options); break;
      case 'loader': this._attachLoader(Component, options); break;
    }

    return this;
  },

  _attachRenderer: function(Renderer, options){
    var instance = new Renderer(this, options);

    if (!(instance instanceof EngineComponents.Renderer)){
      throw new Error('Type of "renderer" must inherit from pac.Renderer');
    }

    this.renderer = instance;
  },

  _attachLoader: function(Loader, options){
    var instance = new Loader(this, options);

    if (!(instance instanceof EngineComponents.Loader)){
      throw new Error('Type of "loader" must inherit from pac.Loader');
    }

    this.loader = instance;
  },

  start: function(){
    this.onEnterScene(this.scenes.current);
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
    this.scenes.update(dt);
    this.emit('update', dt);
  },

  draw: function(){
    this.renderer.render();
    this.emit('draw');
  },

  onLeaveScene: function(scene){
    this.renderer.stage.clear();
  },

  onEnterScene: function(scene){
    this.renderer.stage.add(scene.objects);
  }

}, {

  create: function(options){
    return new Game(options);
  }

});
