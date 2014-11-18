
var ClassExtend = require('./ClassExtend'),
  Gameloop = require('gameloop'),
  GameObjectList = require('./GameObjectList');

var componentTypes = ['renderer', 'loader', 'input', 'scenes'];

var EngineComponents = {
  Renderer: require('./Renderer'),
  Loader: require('./Loader'),
  Scenes: require('./Scenes'),
  Inputs: require('./InputManager')
};

Gameloop.extend = ClassExtend.extend;

var Game = module.exports = Gameloop.extend({

  constructor: function(){
    // call constructor of Gameloop
    Game.__super__.constructor.apply(this, arguments);

    // Engine Components
    this.renderer = null;
    this.loader = null;
    this.inputs = null;
    this.scenes = null;

    this.objects = new GameObjectList();
    this.objects.on('add', this._onAddObject.bind(this));

    // Private members
    this.assetsLoaded = false;
    this.loadingScene = false;
  },

  use: function(type, Component, options){
    this._validateComponent(type, Component);

    switch(type){
      case 'renderer': this._attachRenderer(Component, options); break;
      case 'loader': this._attachLoader(Component, options); break;
      case 'input': this._attachInputs(Component, options); break;
      case 'scenes': this._attachScenes(Component, options); break;
    }

    return this;
  },

  _validateComponent: function(type, Component){
    if (componentTypes.indexOf(type) === -1){
      throw new Error('The type "' + type + '" is not allowed.');
    }

    if (!Component){
      throw new Error('Expected a "' + type + '" Component.');
    }
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

  _attachInputs: function(_inputs, options){

    if (!this.renderer){
      throw new Error('Renderer must be defined before inputs');
    }

    if (!this.renderer.viewport){
      throw new Error('Renderer must define a [viewport] ' +
        'property to attach events');
    }

    options = options || {};
    options.container = this.renderer.viewport;

    this.inputs = EngineComponents.Inputs.create(_inputs, options);
  },

  _attachScenes: function(_scenes, options){

    if (!this.renderer){
      throw new Error('Renderer must be defined before Scenes');
    }

    options = options || {};
    options.size = options.size || this.renderer.size;
    options.game = this;

    this.scenes = new EngineComponents.Scenes(_scenes, options);

    this.scenes.on('exit', this.onExitScene.bind(this));
    this.scenes.on('enter', this.onEnterScene.bind(this));
  },

  start: function(sceneName){

    if (!sceneName){
      throw new
        Error('expected an scene to start with game.start(\'scene-name\');');
    }

    if (!this.scenes){
      throw new Error('must define scenes. game.use(\'scenes\', scenes);');
    }

    this.emit('ready');

    this.loadScene(sceneName);

    Game.__super__.start.call(this);
  },

  pause: function(){
    Game.__super__.pause.call(this);
  },

  resume: function(){
    if (this.paused){
      Game.__super__.start.call(this);
      this.emit('resume');
    }
  },

  end: function(){
    Game.__super__.end.call(this);
  },

  update: function(dt){
    if (this.loadingScene){
      this._switchScene();
    }

    if (this.inputs){
      this.inputs.update(dt);
    }

    this.objects.update(dt);
    this.scenes.update(dt);

    this.emit('update', dt);
  },

  _switchScene: function(){
    this.scenes.switch(this.loadingScene);
    this.loadingScene = null;

    this.objects.each(function(obj){
      obj.onEnterScene();
    });
  },

  draw: function(){
    this.renderer.render();
    this.emit('draw');
  },

  loadScene: function(sceneName){
    this.loadingScene = sceneName;
  },

  getScene: function(){
    return this.scenes.current;
  },

  onExitScene: function(scene){
    this.renderer.clearBackTexture();
    this.renderer.stage.clearLayer();
  },

  onEnterScene: function(scene){
    if (scene.texture){
      this.renderer.setBackTexture(scene.texture);
    }

    this.renderer.stage.addObjects(this.objects);
    this.renderer.stage.addObjects(scene.objects);
    this.renderer.stage.ready();
  },

  addObject: function(toAdd){
    this.objects.add(toAdd);
  },

  _onAddObject: function(obj){
    obj.game = this;
    obj.scene = null;
  },

  findOne: function(search){
    var found = this.objects.findOne(search);

    if (!found && this.scenes && this.scenes.current){
      return this.scenes.current.findOne(search);
    }

    return found;
  },

  find: function(search){
    var gameFounds = this.objects.find(search);
    var sceneFounds;

    if (this.scenes && this.scenes.current){
      sceneFounds = this.scenes.current.find(search);
    }

    if (sceneFounds && sceneFounds.length > 0){
      gameFounds.add(sceneFounds);
    }

    return gameFounds;
  },

}, {

  create: function(options){
    return new Game(options);
  }

});
