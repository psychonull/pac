
var Input = require('./Input');
var _ = require('./utils');
var keyMapping = require('./KeyboardMapping.js');

var KeyboardInput = Input.extend({

  init: function(options) {
    if (!this.container){
      throw new Error('Expected a container');
    }

    this._initKeys(options.keys);

    this._attachEvents();
  },

  _attachEvents: function(){
    if (this.events){
      this._clearEvents();
    }

    this.events = {
      keyup: this._onkeyup.bind(this),
      keydown: this._onkeydown.bind(this)
    };

    _.forIn(this.events, function(event, type){
      window.document.addEventListener(type, event);
    }, this);
  },

  _clearEvents: function(){
    _.forIn(this.events, function(event, type){
      this.container.removeEventListener(type, event);
    }, this);
  },

  _onkeyup: function(e){
    if (!this.enabled) return;
    if(!keyMapping[e.keyCode]){
      return;
    }
    var key = keyMapping[e.keyCode].toUpperCase();
    if(!this.keys[key]){
      return;
    }
    this.keys[key].isDown = false;
    this.emit(Input.events.KEYUP, key, e);
  },

  _onkeydown: function(e){
    if (!this.enabled) return;
    if(!keyMapping[e.keyCode]){
      return;
    }
    var key = keyMapping[e.keyCode].toUpperCase();
    if(!this.keys[key]){
      return;
    }
    this.keys[key].isDown = true;
    this.emit(Input.events.KEYDOWN, key, e);
  },

  _initKeys: function(keys){
    var keysToUse;
    this.keys = {};
    if(!keys){
      keysToUse = _(keyMapping).values().uniq().valueOf();
    }
    else {
      keysToUse = keys;
    }
    _.forEach(keysToUse, function(key){
      this.keys[key.toUpperCase()] = {
        isDown: false
      };
    }, this);
  }

});

module.exports = KeyboardInput;
