
var Emitter = require('./Emitter');
var Scene = require('./Scene');

module.exports = Emitter.extend({

  current: null,
  _scenes: null,

  init: function(){
    this._scenes = [];

  },

  add: function(){
    var arg0 = arguments[0];

    if(Array.isArray(arg0)){

      arg0.forEach(function(scene){
        this._addOne(scene);
      }, this);

    }
    else {
      this._addOne(arg0);
    }

    return this;
  },

  get: function(name){
    for(var i = 0; i < this._scenes.length; i++){
      if(this._scenes[i].name === name){
        return this._scenes[i];
      }
    }
    return null;
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

  _addOne: function(scene){

    if (scene instanceof Scene){
      this._scenes.push(scene);
      return;
    }

    this._scenes.push(new Scene(scene));
  }


});
