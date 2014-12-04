
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

  _createLayer: function(name){
    var pixiLayer = new PIXI.DisplayObjectContainer();
    this.pixiStage.addChild(pixiLayer);
    pixiLayer.scale.x = pixiLayer.scale.y = this.scale;
    pixiLayer.layer = name;
    this.pixiLayers[name] = pixiLayer;
  },

  _buildLayers: function(){

    // build PIXI layers in the order of this.layers

    this.pixiLayers = {};

    if (this.layers){

      this.layers.forEach(function(name){

        if (name !== 'default') { // skip default if is there
          this._createLayer(name);
        }
      }, this);
    }

    // Add 'default' Layer always last since is always at front of all
    this._createLayer('default');
  },

  addChild: function(child, parent, index){
    if (index >= 0){
      parent.addChildAt(child, index);
    }
    else {
      parent.addChild(child);
    }
  },

  onAddObject: function(obj, layer){
    var idx = this.stage.get(layer).indexOf(obj);
    var pixiLayer = this.pixiLayers[layer];

    this._createPixiObject(obj, pixiLayer, idx);
    this._createChildren(obj, pixiLayer);
  },

  onRemoveObject: function(obj, layer){
    var pixiLayer = this.pixiLayers[layer];

    this._clearPixiObjectChildren(obj, pixiLayer);
    this._removePixiObject(obj, pixiLayer);
  },

  onLayerFill: function(layer){

    this.stage.get(layer).each(function(obj, index){

      var pixiLayer = this.pixiLayers[layer];
      this._createPixiObject(obj, pixiLayer);
      this._createChildren(obj, pixiLayer);

    },this);
  },

  onLayerClear: function(layer){

    if (this.pixiStage && this.pixiLayers[layer]){
      this.pixiLayers[layer].removeChildren();
    }

  },

  _createPixiObject: function(obj, parent, index){
    var textures = this.game.cache.images;

    if(obj instanceof Sprite){

      var image = textures.get(obj.texture).raw();
      var baseTexture = new PIXI.BaseTexture(image);
      var texture = new PIXI.Texture(baseTexture);

      // create a new Sprite using the texture
      var sprite = new PIXI.Sprite(texture);
      this._setSpriteProperties(obj, sprite);
      sprite.cid = obj.cid;

      this.addChild(sprite, parent, index);
      //parent.addChild(sprite);
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

      this.addChild(text, parent, index);
      //parent.addChild(text);
    }
    else if (obj instanceof Shape){
      var graphics = new PIXI.Graphics();

      graphics.position.x = obj.position.x;
      graphics.position.y = obj.position.y;

      var shape = this._createShape(obj, graphics);

      if (shape){
        this._setObjectProperties(obj, shape);
        shape.cid = obj.cid;

        this.addChild(shape, parent, index);
        //parent.addChild(shape);
      }
    }

    this._drawDebug(obj, parent, index);
  },

  _createChildren: function(obj, pixiLayer){
    if (obj.children){

      obj.children.each(function(child){
        this._createPixiObject(child, pixiLayer);
      }, this);

      //HACK
      obj.children.on('add', _.bind(function(c){
        this._createPixiObject(c, pixiLayer);
      }, this));

      obj.children.on('remove', _.bind(function(c){
        this._removePixiObject(c, pixiLayer);
      }, this));

      obj.children.on('clear', _.bind(function(){
        //TODO: obj.children is already cleared here so this doesnt work
        //this._clearPixiObjectChildren(obj, pixiLayer);
      }, this));
    }
  },

  _removePixiObject: function(obj, parent){
    var pixiObj = this._getPixiObjectByCID(obj.cid, parent);

    if(pixiObj){
      parent.removeChild(pixiObj);
    }

    if(pac.DEBUG && obj.shape){
      var debugPixiObj = this._getPixiObjectByCID(obj.shape.cid, parent);

      if(debugPixiObj){
        parent.removeChild(debugPixiObj);
      }
    }
  },

  _clearPixiObjectChildren: function(obj, parent){
    var that = this;
    if(obj.children){
      obj.children.each(function(c){
        that._removePixiObject(c, parent);
      });
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
    sprite.visible = obj.visible;
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

    if(obj.isBitmapText && obj.wordWrap){
      text.setText(this._wrapBitmapText(obj));
    }
    else {
      text.setText(obj.value);
    }
    if(obj.isBitmapText && obj.tint){
      text.tint = obj.tint;
    }
    text.visible = obj.visible;

    if(obj.wrapToScreen && obj.wordWrap){
      if(obj.position.x + obj.wordWrap > this.size.width){
        text.position.x = this.size.width - obj.wordWrap;
      }
      else if(obj.position.x < 0){
        text.position = 0;
      }
    }

  },

  _getPixiObjectByCID: function(cid, container){
    //TODO: Change this with a local Associative Array by CID
    return _.find(container.children, { cid: cid });
  },

  _updateProperties: function(){

    this.stage.each(function(stageLayer, layer){

      var pixiLayer = this.pixiLayers[layer];

      stageLayer.each(function(obj){

        var pixiObj = this._getPixiObjectByCID(obj.cid, pixiLayer);
        if (pixiObj){
          this._setObjectProperties(obj, pixiObj);
          this._drawDebug(obj, pixiLayer);
        }

        if (obj.children){

          obj.children.each(function(child){

            pixiObj = this._getPixiObjectByCID(child.cid, pixiLayer);
            if (pixiObj){
              this._setObjectProperties(child, pixiObj);
              pixiObj.visible = obj.visible && child.visible;
              this._drawDebug(child, pixiLayer);
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
        pixiObj.position.x = obj.position.x;
        pixiObj.position.y = obj.position.y;

        this._createShape(obj, pixiObj);
      }
      pixiObj.visible = obj.visible;
    }
  },

  _wrapBitmapText: function(obj){
    //TODO: Find a better way, performance-wise at least
    var text = new PIXI.BitmapText(obj.value, obj);
    var wrapWidth = obj.wordWrap;
    if(text.textWidth <= wrapWidth){
      return text.text;
    }
    var words = text.text.split(' ');
    var temp = words[0];
    var result = temp;
    for(var i=1; i < words.length; i++){
      temp = result + ' ' + words[i];
      text = new PIXI.BitmapText(temp, obj);
      if(text.textWidth > wrapWidth){
        temp = result + '\n' + words[i];
        text = new PIXI.BitmapText(temp, obj);
      }
      result = temp;
    }
    result = temp;
    return result;
  },

  _createShape: function(obj, graphics){
    graphics.clear();

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
  },


  _drawDebug: function(obj, container, index){

    if (pac.DEBUG && obj.shape){
      var shape = obj.shape;

      var graphics = this._getPixiObjectByCID(obj.shape.cid, container);

      if (!graphics){
        graphics = new PIXI.Graphics();
      }

      graphics.alpha = 0.4;
      shape.fill = '#00ff00';

      if (!obj.active){
        shape.fill = '#ff0000';
      }

      var pos = obj.position.add(shape.position);

      graphics.position.x = pos.x;
      graphics.position.y = pos.y;

      var draw = this._createShape(shape, graphics);

      if (draw){
        draw.cid = shape.cid;
        this.addChild(draw, container, index);
        //container.addChild(draw);
      }
    }
  }

});
