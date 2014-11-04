
var MapList = require('./MapList');
var Animation = require('./Animation');

var AnimationList = module.exports = MapList.extend({

  childType: Animation,

  default: null,
  autoplay: null,
  current: null,

  init: function(data, options){
    AnimationList.__super__.init.apply(this, arguments);

    this.on('add', this._initAnimation.bind(this));

    this.each(function (value, key){
      this._initAnimation(key, value);
    }, this);

    this.default = (options && options.default) || this.default;
    this.autoplay = (options && options.autoplay) || this.autoplay;

    this.current = null;

    if (this.default){
      this._setDefault();

      if (this.autoplay){
        this.play();
      }
    }
  },

  _initAnimation: function(name, animation){
    animation._name = name;

    // on any animation end -> run default (loops dont fire end event)
    animation.on('end', this._playDefault.bind(this));
  },

  _playDefault: function(){
    if (this.default){
      this._setDefault();
      this.play();
    }
  },

  _setDefault: function(){
    var curr = this.current;
    if (!curr || (curr && curr._name !== this.default)) {

      var found = this.get(this.default);
      if (found){
        this.current = found;
      }
    }
  },

  play: function(name){

    if (name){
      var found = this.get(name);
      if (found){
        this.stop();
        this.current = found;
      }
      else {
        //TODO: throw an error?
        return;
      }
    }

    if (this.current && !this.current.isRunning){
      this.current.play();
    }
  },

  stop: function(){
    if (this.current){
      this.current.stop();
    }
  },

  pause: function(){
    if (this.current){
      this.current.pause();
    }
  },

  resume: function(){
    if (this.current){
      this.current.resume();
    }
  },

  update: function(dt){
    if (this.current && this.current.isRunning){
      this.current.update(dt);
    }
  }

});
