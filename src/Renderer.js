
var EngineComponent = require('./EngineComponent');
var Stage = require('./Stage');

module.exports = EngineComponent.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',
  container: null,

  init: function(game, options){
    this.game = game;
    this.stage = new Stage();

    var self = this;
    this.stage.on('add', function(key, value){
      self.onStageAdd(value);
    });

    //this.stage.on('clear', this.onStageClear.bind(this));

    this.container = document.body;

    if (options){
      this.size = options.size || this.size;
      this.backgroundColor = options.backgroundColor || this.backgroundColor;
      this.container = options.container || this.container;
    }
  },

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
