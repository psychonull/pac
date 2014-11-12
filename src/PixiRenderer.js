
var Renderer = require('./Renderer');
var Sprite = require('./Sprite');
var Text = require('./Text');

var Shape = require('./Shape');
var Rectangle = require('./Rectangle');
var Circle = require('./Circle');
var Polygon = require('./Polygon');

var PIXI = require('pixi.js');

var _ = require('./utils');

var PixiRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
    var bg = this.backgroundColor.replace('#', '0x');
    this.pixiStage = new PIXI.Stage(bg);

    this.pixiRenderer = PIXI.autoDetectRenderer(
      this.size.width, this.size.height);

    this.pixiRenderer.resize(
      this.size.width * this.scale,
      this.size.height * this.scale
    );

    this.container.appendChild(this.pixiRenderer.view);
    this.viewport = this.pixiRenderer.view;

    //add background contariner first so it's at back of everything
    this.pixiBack = new PIXI.DisplayObjectContainer();
    this.pixiBack.scale.x = this.pixiBack.scale.y = this.scale;
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
          pixiLayer.scale.x = pixiLayer.scale.y = this.scale;
          pixiLayer.layer = name;
          this.pixiLayers[name] = pixiLayer;
        }

      }, this);
    }

    // Add 'default' Layer always last since is always at front of all

    var pixiLayerDefault = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(pixiLayerDefault);
    pixiLayerDefault.scale.x = pixiLayerDefault.scale.y = this.scale;
    pixiLayerDefault.layer = 'default';
    this.pixiLayers['default'] = pixiLayerDefault;

  },

  onLayerFill: function(layer){

    this.stage.get(layer).each(function(obj, index){

      var pixiLayer = this.pixiLayers[layer];
      this._createPixiObject(obj, pixiLayer);

      if (obj.children){
        obj.children.each(function(child){
          this._createPixiObject(child, pixiLayer);
        }, this);
      }
    },this);

  },

  onLayerClear: function(layer){

    if (this.pixiStage && this.pixiLayers[layer]){
      this.pixiLayers[layer].removeChildren();
    }

  },

  _createPixiObject: function(obj, parent){
    var textures = this.game.cache.images;

    if(obj instanceof Sprite){

      var image = textures.get(obj.texture).raw();
      var baseTexture = new PIXI.BaseTexture(image);
      var texture = new PIXI.Texture(baseTexture);

      // create a new Sprite using the texture
      var sprite = new PIXI.Sprite(texture);
      this._setSpriteProperties(obj, sprite);
      sprite.cid = obj.cid;

      parent.addChild(sprite);
    }
    else if (obj instanceof Text){
      var text;
      if (obj.isBitmapText){
        text = new PIXI.BitmapText(obj.value, obj);
      }
      else {
        text = new PIXI.Text(obj.value, obj);
      }
      this._setTextProperties(obj, text);
      text.cid = obj.cid;

      parent.addChild(text);
    }
    else if (obj instanceof Shape){
      var graphics = new PIXI.Graphics();
      var shape = this._createShape(obj, graphics);

      if (shape){
        this._setObjectProperties(obj, shape);
        shape.cid = obj.cid;

        parent.addChild(shape);
      }
    }
  },

  render: function () {
    this._updateProperties();
    this.pixiRenderer.render(this.pixiStage);
  },

  _setSpriteProperties: function(obj, sprite){

    var textures = this.game.cache.images;
    var txtFrames = textures.get(obj.texture).frames;

    if (obj.frame !== null && txtFrames){
      var objFrame = txtFrames.get(obj.frame);
      sprite.texture.setFrame(objFrame);
    }

    sprite.anchor.x = 0;
    sprite.anchor.y = 0;

    sprite.position.x = obj.position.x;
    sprite.position.y = obj.position.y;

    sprite.width = obj.size.width;
    sprite.height = obj.size.height;
  },

  _setTextProperties: function(obj, text){
    text.position.x = obj.position.x;
    text.position.y = obj.position.y;
    text.setStyle({
      font: obj.font,
      fill: obj.fill,
      stroke: obj.stroke,
      strokeThickness: obj.strokeThickness,
      wordWrap: !!obj.wordWrap,
      wordWrapWidth: obj.wordWrap
    });
  },

  _getPixiObjectByCID: function(cid, container){

    //TODO: Change this with a local Associative Array by CID

    for (var i = container.children.length - 1; i >= 0; i--) {
      var pixiObj = container.children[i];
      if (pixiObj.cid === cid){
        return pixiObj;
      }
    }

    return null;
  },

  _updateProperties: function(){

    this.stage.each(function(stageLayer, layer){

      var pixiLayer = this.pixiLayers[layer];

      stageLayer.each(function(obj){

        var pixiObj = this._getPixiObjectByCID(obj.cid, pixiLayer);
        if (pixiObj){
          this._setObjectProperties(obj, pixiObj);
        }

        if (obj.children){

          obj.children.each(function(child){

            pixiObj = this._getPixiObjectByCID(child.cid, pixiLayer);
            if (pixiObj){
              this._setObjectProperties(child, pixiObj);
            }

          }, this);
        }

      }, this);

    }, this);

  },

  _setObjectProperties: function(obj, pixiObj){
    if (obj){
      if(obj instanceof Sprite){
        this._setSpriteProperties(obj, pixiObj);
      }
      else if (obj instanceof Text){
        this._setTextProperties(obj, pixiObj);
      }
      else if(obj instanceof Shape){
        this._createShape(obj, pixiObj);
      }
    }
  },

  _createShape: function(obj, graphics){
    graphics.clear();

    graphics.position.x = obj.position.x;
    graphics.position.y = obj.position.y;

    if (obj.fill){
      graphics.beginFill(obj.fill.replace('#', '0x'));
    }

    if (obj.stroke){
      graphics.lineStyle(obj.lineWidth, obj.stroke.replace('#', '0x'), 1);
    }
    else {
      graphics.lineStyle(1, 0x000000, 0);
    }

    if (obj instanceof Rectangle){
      return graphics.drawRect(0,0, obj.size.width, obj.size.height);
    }
    else if (obj instanceof Circle){
      return graphics.drawCircle(0, 0, obj.radius);
    }
    else if (obj instanceof Polygon){
      return graphics.drawPolygon(obj.getPath());
    }

    // if the shape is not implemented for being drawn.
    return null;
  },

  onGameLoaderComplete: function(){

    var convertFontDataToPIXI = function(data, key){
      var xSpacing = 0, ySpacing = 0; // Hardcoded
      var result = {};
      result.font = data.info.face;
      result.size = data.info.size;
      result.lineHeight = data.common.lineHeight + ySpacing;
      result.chars = {};
      _.forEach(data.chars, function(char){
        var charCode = char.id;
        var textureRect = new PIXI.Rectangle(
          char.x, char.y, char.width, char.height
        );
        result.chars[charCode] = {
          xOffset: char.xoffset,
          yOffset: char.yoffset,
          xAdvance: char.xadvance + xSpacing,
          kerning: {},
          texture: PIXI.TextureCache[key] =
            new PIXI.Texture(PIXI.BaseTextureCache[key], textureRect)
        };
      });
      //TODO: Implement kernings?
      return result;
    };

    this.game.cache.bitmapFont.each(function(font, key){
      var raw = font.raw();
      PIXI.BaseTextureCache[key] = new PIXI.BaseTexture(raw.texture);
      PIXI.TextureCache[key] = new PIXI.Texture(PIXI.BaseTextureCache[key]);
      PIXI.BitmapText.fonts[key] = convertFontDataToPIXI(raw.definition, key);
    }, this);
  }

});
