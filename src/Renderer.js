
var EngineComponent = require('./EngineComponent');
var Stage = require('./Stage');

module.exports = EngineComponent.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000',

  init: function(options){
    this.stage = new Stage();

    this.stage.on('add', this.onStageAdd.bind(this));
    this.stage.on('clear', this.onStageClear.bind(this));

    if (options){
      this.size = options.size || this.size;
      this.backgroundColor = options.backgroundColor || this.backgroundColor;
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
