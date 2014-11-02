
var Renderer = require('./Renderer');
var PIXI = require('pixi.js');

var PixiRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    var bg = this.backgroundColor.replace('#', '0x');
    this.pixiStage = new PIXI.Stage(bg);

    this.pixiRenderer = PIXI.autoDetectRenderer(
      this.size.width, this.size.height);

    this.container.appendChild(this.pixiRenderer.view);
  },

  onStageAdd: function(obj){

    var textures = this.game.cache.images;

    var image = textures.get(obj.texture).image;
    var baseTexture = new PIXI.BaseTexture(image);
    var texture = new PIXI.Texture(baseTexture);

    /*
      // use the entire texture, no crop
      var texture = new PIXI.Texture(baseTexture);
      var sprite = new PIXI.Sprite(texture);

      // Sprite with size
      var texture = new PIXI.Texture(baseTexture);
      var sprite = new PIXI.TilingSprite(texture, 
        obj.size.width, obj.size.height);
      
      obj.frame = { x, y, width, height };

      // Use a texture frame
      var texture = new PIXI.Texture ( baseTexture , obj.frame,  [crop] )
      var sprite = new PIXI.TilingSprite(texture, 
        obj.size.width, obj.size.height);
  
      // change current frame later
      texture.setFrame(obj.frame);
    */

    // create a new Sprite using the texture
    var sprite = new PIXI.Sprite(texture);
    this._setSpriteProperties(obj, sprite);
    sprite.cid = obj.cid;
 
    this.pixiStage.addChild(sprite);
  },

  onStageClear: function(){

    if (this.pixiStage){
      
      for (var i = this.pixiStage.children.length - 1; i >= 0; i--) {
        this.pixiStage.removeChild(this.pixiStage.children[i]);
      }
    }

  },

  render: function () {
    this._updateProperties();
    this.pixiRenderer.render(this.pixiStage);
  },

  _setSpriteProperties: function(obj, sprite){
    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
 
    sprite.position.x = obj.position.x;
    sprite.position.y = obj.position.y;

    sprite.width = obj.size.width;
    sprite.height = obj.size.height;
  },

  _updateProperties: function(){
    
    for (var i = this.pixiStage.children.length - 1; i >= 0; i--) {
      var pixiSp = this.pixiStage.children[i];
      var obj = this.stage.get(pixiSp.cid);

      if (obj){
        this._setSpriteProperties(obj, pixiSp);
      }
    }
  }

});
