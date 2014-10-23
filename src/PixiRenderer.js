
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
    
    // create a texture from an image path
    var texture = PIXI.Texture.fromImage(obj.resource);

    // create a new Sprite using the texture
    var sprite = new PIXI.Sprite(texture);
 
    // center the sprites anchor point
    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
 
    // move the sprite t the center of the screen
    sprite.position.x = obj.position.x;
    sprite.position.y = obj.position.y;
 
    this.pixiStage.addChild(sprite);
    
  },

  onStageClear: function(){
    
  },

  render: function () {
    this.pixiRenderer.render(this.pixiStage);
  }

});
