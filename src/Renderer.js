
var EngineComponent = require('./EngineComponent');
var Stage = require('./Stage');
var Layer = require('./Layer');
var _ = require('./utils');

var Renderer = module.exports = EngineComponent.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',
  container: null,
  layers: null,
  scale: 1,

  constructor: function(game, options){
    this.game = game;

    if(this.game && this.game.loader){
      this.game.loader.on('complete', this.onGameLoaderComplete.bind(this));
    }

    this.container = document.body;

    _.extend(
      this,
      _.pick(options,
        ['size', 'backgroundColor', 'container', 'layers', 'scale'])
    );

    this._createStage();

    EngineComponent.apply(this, arguments);
  },

  _createStage: function(){
    this.stage = Stage.create(this.layers);

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
  },

  onGameLoaderComplete: function(){}

});
