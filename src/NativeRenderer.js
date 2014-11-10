
var Renderer = require('./Renderer'),
  Sprite = require('./Sprite'),
  Text = require('./Text');

var NativeRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    var canvas = document.createElement('canvas');

    canvas.style.backgroundColor = this.backgroundColor;
    canvas.width = this.size.width;
    canvas.height = this.size.height;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.container.appendChild(this.canvas);
    this.viewport = this.canvas;

    if (!this.layers){
      this.layers = [];
    }

    //TODO: check if 'default' is already there

    // set 'default' as last layer.
    this.layers.push('default');

    this.backImage = null;
  },

  setBackTexture: function(texture){
    var textures = this.game.cache.images;
    this.backImage = textures.get(texture).raw();
  },

  clearBackTexture: function(){
    this.backImage = null;
  },

  onLayerFill: function(layer){

    this.stage.get(layer).each(function(obj, index){

      if(obj instanceof Sprite){
        var textures = this.game.cache.images;

        var texture = textures.get(obj.texture);
        obj.image = texture.raw();
        obj.frames = texture.frames;
      }

    }, this);

  },

  onLayerClear: function(layer){
    // Nothing to do for Naive implementation
  },

  render: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.backImage){
      this.context.drawImage(this.backImage, 0, 0);
    }

    // run from this.layers array (it is the layers sort)
    this.layers.forEach(function(name){

      var layer = this.stage.get(name);

      layer.each(function(o){
        if(o instanceof Sprite){
          this._renderSprite(o);
        }
        else if(o instanceof Text){
          this._renderText(o);
        }

      }, this);

    }, this);

  },

  _renderSprite: function(o){
    if (o.frame !== null && o.frames){
      var frm = o.frames.get(o.frame);

      this.context.drawImage(o.image,
        frm.x, frm.y, frm.width, frm.height,
        o.position.x, o.position.y, o.size.width, o.size.height);
    }
    else {
      this.context.drawImage(o.image,
        o.position.x, o.position.y, o.size.width, o.size.height);
    }
  },

  _renderText: function(o){
    var ctx = this.context;
    ctx.textBaseline = 'top';
    ctx.font = o.font;
    ctx.fillStyle = o.fill;
    ctx.lineWidth = o.strokeThickness;
    ctx.strokeStyle = o.stroke;
    if(o.wordWrap){
      this._wrapTextAndDraw(o);
    }
    else {
      ctx.fillText(o.value, o.position.x, o.position.y);
      if(o.strikeThickness){
        ctx.strokeText(o.value, o.position.x, o.position.y);
      }
    }
    ctx.restore();
  },

  _wrapTextAndDraw: function(o){
    var words = o.value.split(' ');
    var line = '';
    var x = o.position.x,
      y = o.position.y;
    for(var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > o.wordWrap && n > 0) {
        this.context.fillText(line, x, y);
        line = words[n] + ' ';
        //TODO: Provide proper lineHeight instead of this ugly hack.
        y += parseInt(o.font, 10) + 2;
      }
      else {
        line = testLine;
      }
    }
    this.context.fillText(line, x, y);
    if(o.strikeThickness){
      this.context.strokeText(o.value, o.position.x, o.position.y);
    }
  }

});
