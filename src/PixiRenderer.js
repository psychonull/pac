
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

    //add background contariner first so it's at back of everything
    this.pixiBack = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(this.pixiBack);

    this._buildLayers();
  },

  setBackTexture: function(texture){
    
    var textures = this.game.cache.images;

    var image = textures.get(texture).raw();
    var baseTexture = new PIXI.BaseTexture(image);
    var pixiTexture = new PIXI.Texture(baseTexture);

    var sprite = new PIXI.Sprite(pixiTexture);
    this.pixiBack.addChild(sprite);
  },

  clearBackTexture: function(){
    // clear current sprite in the background
    this.pixiBack.removeChildren();
  },

  _buildLayers: function(){

    // build PIXI layers in the order of this.layers

    this.pixiLayers = {};

    if (this.layers){

      this.layers.forEach(function(name){

        if (name !== 'default') { // skip default if is there

          var pixiLayer = new PIXI.DisplayObjectContainer();
          this.pixiStage.addChild(pixiLayer);

          pixiLayer.layer = name;
          this.pixiLayers[name] = pixiLayer;
        }

      }, this);
    }

    // Add 'default' Layer always last since is always at front of all

    var pixiLayerDefault = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(pixiLayerDefault);

    pixiLayerDefault.layer = 'default';
    this.pixiLayers['default'] = pixiLayerDefault;

  },

  onLayerFill: function(layer){

    this.stage.get(layer).each(function(obj, index){

      var textures = this.game.cache.images;

      var image = textures.get(obj.texture).raw();
      var baseTexture = new PIXI.BaseTexture(image);
      var texture = new PIXI.Texture(baseTexture);

      // create a new Sprite using the texture
      var sprite = new PIXI.Sprite(texture);
      this._setSpriteProperties(obj, sprite);
      sprite.cid = obj.cid;
   
      this.pixiLayers[layer].addChild(sprite);

    },this);
    
  },

  onLayerClear: function(layer){

    if (this.pixiStage && this.pixiLayers[layer]){
      this.pixiLayers[layer].removeChildren();
    }
    
  },

  render: function () {
    this._updateProperties();
    this.pixiRenderer.render(this.pixiStage);
  },

  _setSpriteProperties: function(obj, sprite){

    var textures = this.game.cache.images;
    var txtFrames = textures.get(obj.texture).frames;

    if (txtFrames){
      var anim = obj.animations && obj.animations.current;
      var frame = anim && anim.frame;

      if (frame >= 0){
        var objFrame = txtFrames.at(frame);
        sprite.texture.setFrame(objFrame);
      }
    }

    sprite.anchor.x = 0;
    sprite.anchor.y = 0;
 
    sprite.position.x = obj.position.x;
    sprite.position.y = obj.position.y;

    sprite.width = obj.size.width;
    sprite.height = obj.size.height;
  },

  _updateProperties: function(){
    
    for (var layer in this.pixiLayers) {

      if (this.pixiLayers.hasOwnProperty(layer)){

        var stageLayer = this.stage.get(layer);
        var pixiLayer = this.pixiLayers[layer];

        for (var i = pixiLayer.children.length - 1; i >= 0; i--) {
          var pixiSp = pixiLayer.children[i];
          var obj = stageLayer.get(pixiSp.cid);

          if (obj){
            this._setSpriteProperties(obj, pixiSp);
          }
        }

      }
    }
  }

});
