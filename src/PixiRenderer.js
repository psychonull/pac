
var Renderer = require('./Renderer');
var PIXI = require('pixi.js');

var PixiRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    PixiRenderer.__super__.init.apply(this, arguments);

    var bg = this.backgroundColor.replace('#', '0x');
    this.pixiStage = new PIXI.Stage(bg);

    this.pixiRenderer = PIXI.autoDetectRenderer(
      this.size.width, this.size.height);

    this.container.appendChild(this.pixiRenderer.view);
  },

  onStageAdd: function(obj){
    
  },

  onStageClear: function(){
    
  },

  render: function () {
    this.pixiRenderer.render(this.pixiStage);
  }

});
