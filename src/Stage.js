
var MapList = require('./MapList');
var Layer = require('./Layer');
var GameObject = require('./GameObject');
var List = require('./List');

var _ = require('./utils');

var Stage = module.exports = MapList.extend({

  childType: Layer,
  length: 0,

  init: function(data, options){
    Stage.__super__.init.apply(this, arguments);

    this.defaultName = 'default';

    if (!this.hasKey(this.defaultName)){
      this._set(new Layer(), this.defaultName);
    }

    this.on('add', this._initLayer.bind(this));
    this.each(this._initLayer.bind(this));

    this.layers = (options && options.layers) || [];
    if (this.layers.length === 0){
      this.each(function(layer, name){
        this.layers.push(name);
      }, this);
    }

    this.isReady = false;
  },

  _initLayer: function(layer, name){

    var self = this;

    layer.on('add', function(obj){
      (function(_name){
        if (self.isReady){
          self.emit('addToLayer', obj, _name);
        }
      })(name);
    });

    layer.on('remove', function(obj){
      (function(_name){
        if (self.isReady){
          self.emit('removeFromLayer', obj, _name);
        }
      })(name);
    });

    layer.on('clear', function(obj){
      (function(_name){ self.emit('layerClear', _name); })(name);
    });

  },

  _addToLayer: function(obj){

    if (!(obj instanceof GameObject)){
      return;
    }

    if (obj.layer && this.hasKey(obj.layer)){
      this.get(obj.layer).add(obj);
    }
    else {
      this.get(this.defaultName).add(obj);
    }
  },

  ready: function(){

    this.each(function(layer, name){
      this.emit('layerFill', name);
    }, this);

    this.isReady = true;
  },

  addObjects: function(){
    var arg0 = arguments[0];

    if(Array.isArray(arg0)){
      arg0.forEach(this._addToLayer.bind(this));
      return this;
    }

    if (arg0 instanceof List){
      arg0.each(this._addToLayer.bind(this));
      return this;
    }

    this._addToLayer(arg0);
    return this;
  },

  removeObject: function(obj){
    if (!obj) return;

    if (obj.layer && this.hasKey(obj.layer)){
      this.get(obj.layer).remove(obj);
    }
    else {
      this.get(this.defaultName).remove(obj);
    }
  },

  clearLayer: function(layerName){

    if (layerName){
      var layer = this.get(layerName);

      if (layer){
        layer.clear();
      }

      return this;
    }

    this.isReady = false;

    this.each(function(layer){
      if (layer.length > 0){
        layer.clear();
      }
    });

    return this;
  },

  getFrontObject: function(){
    var found = null;

    _.forEachRight(this.layers, function(name){

      if (!found){
        found = this.get(name).last();
        if (found){
          return false;
        }
      }

    }, this);

    return found;
  }

}, {

  create: function(layersArr){
    var layers = {};

    if (layersArr){
      layersArr.forEach(function(layer){
        layers[layer] = new Layer();
      });
    }

    return new Stage(layers);
  }

});
