
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

    this.stage.on('addToLayer', this.onStageAdd.bind(this));
    this.stage.on('layerClear', this.onStageClear.bind(this));
  },

  init: function(game, options) { },

  onStageAdd: function(obj, layer){
    throw new Error('Must override renderer.onStageAdd()');
  },

  onStageClear: function(layer){
    throw new Error('Must override renderer.onStageClear()');
  },

  render: function () {
    throw new Error('Must override renderer.render()');
  }

});
