
var MapList = require('./MapList');
var Scene = require('./Scene');

var Scenes = module.exports = MapList.extend({

  current: null,
  childType: Scene,

  add: function(){
    var arg0 = arguments[0];

    if(Array.isArray(arg0)){

      arg0.forEach(function(scene){
        Scenes.__super__.add.call(this, scene.name, scene);
      }, this);

      this._setDefault(arg0[0]);

      return this;
    }

    Scenes.__super__.add.call(this, arg0.name, arg0);

    this._setDefault(arg0);

    return this;
  },

  _setDefault: function(scene){

    if (!this.current && this.length > 0){
      this.current = scene;
    }
  },

  switch: function(name){
    var targetScene = this.get(name),
      previousScene = this.current;

    if(!targetScene){
      throw new Error('Scene not found: "' + name + '"');
    }

    if(previousScene){
      previousScene.emit('leave');
    }
    
    targetScene.emit('enter');
    this.current =  targetScene;
  },

  update: function(dt){
    if (this.current){
      this.current.update(dt);
    }
  }


});
