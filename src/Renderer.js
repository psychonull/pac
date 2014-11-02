
var EngineComponent = require('./EngineComponent');
var Stage = require('./Stage');

var Renderer = module.exports = EngineComponent.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',
  container: null,

  constructor: function(game, options){
    this.game = game;
    this.stage = new Stage();

    this.stage.on('add', this.onStageAdd.bind(this));
    this.stage.on('clear', this.onStageClear.bind(this));

    this.container = document.body;

    if (options){
      this.size = options.size || this.size;
      this.backgroundColor = options.backgroundColor || this.backgroundColor;
      this.container = options.container || this.container;
    }

    //Renderer.__super__.constructor.apply(this, arguments);
    EngineComponent.apply(this, arguments);
  },

  init: function(game, options) { },

  onStageAdd: function(obj){
    throw new Error('Must override renderer.onStageAdd()');
  },

  onStageClear: function(){
    throw new Error('Must override renderer.onStageClear()');
  },

  render: function () {
    throw new Error('Must override renderer.render()');
  }

});
