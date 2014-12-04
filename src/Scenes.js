
var MapList = require('./MapList');
var Scene = require('./Scene');

var Scenes = module.exports = MapList.extend({

  current: null,
  childType: Scene,

  init: function(data, options){
    Scenes.__super__.init.apply(this, arguments);

    this.game = (options && options.game) || this.game;
    this.size = (options && options.size) || this.size;

    this.on('add', this._initScene.bind(this));
    this.each(this._initScene.bind(this));

    this.eventAddObj = this._addObject.bind(this);
    this.eventRemoveObj = this._removeObject.bind(this);
  },

  _initScene: function(scene, name){
    scene.name = name;
    scene.game = this.game;

    if (!scene.size){
      scene.size = this.size;
    }
  },

  switch: function(name){
    var targetScene = this.get(name),
      previousScene = this.current;

    if(!targetScene){
      throw new Error('Scene not found: "' + name + '"');
    }

    if(previousScene){

      previousScene
        .removeListener('addObject', this.eventAddObj)
        .removeListener('removeObject', this.eventRemoveObj);

      previousScene.onExit(targetScene);
      this.emit('exit', previousScene);
    }

    this.current = targetScene;

    targetScene.onEnter(previousScene);
    this.emit('enter', targetScene);

    if(previousScene){
      previousScene.clear();
    }

    targetScene
      .on('addObject', this.eventAddObj)
      .on('removeObject', this.eventRemoveObj);
  },

  _addObject: function(obj){
    this.emit('addObject', obj);
  },

  _removeObject: function(obj){
    this.emit('removeObject', obj);
  },

  update: function(dt){
    if (this.current){
      this.current._update(dt);
    }
  }

});
