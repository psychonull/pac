
var Emitter = require('./Emitter');
var Scene = require('./Scene');

module.exports = Emitter.extend({

  _current: null,
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

  load: function(){

  },

  _addOne: function(scene){

    if (scene instanceof Scene){
      this._scenes.push(scene);
      return;
    }

    this._scenes.push(new Scene(scene));
  }


});
