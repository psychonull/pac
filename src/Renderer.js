
var EngineComponent = require('./EngineComponent');
var Stage = require('./Stage');
var Layer = require('./Layer');

var Renderer = module.exports = EngineComponent.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',
  container: null,
  layers: null,

  constructor: function(game, options){
    this.game = game;
    
    this.container = document.body;

    if (options){
      this.size = options.size || this.size;
      this.backgroundColor = options.backgroundColor || this.backgroundColor;
      this.container = options.container || this.container;
      this.layers = options.layers || this.layers;
    }

    this._createStage();

    EngineComponent.apply(this, arguments);
  },

  _createStage: function(){
    var layers = {};

    if (this.layers){
      this.layers.forEach(function(layer){
        layers[layer] = new Layer();
      });
    }

    this.stage = new Stage(layers);

    this.stage.on('layerFill', this.onLayerFill.bind(this));
    this.stage.on('layerClear', this.onLayerClear.bind(this));
  },

  init: function(game, options) { },

  setBackTexture: function(texture){ },
  clearBackTexture: function(){ },

  onLayerFill: function(layer){
    throw new Error('Must override renderer.onLayerFill()');
  },

  onLayerClear: function(layer){
    throw new Error('Must override renderer.onLayerClear()');
  },

  render: function () {
    throw new Error('Must override renderer.render()');
  }

});
