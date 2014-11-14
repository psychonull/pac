
var Renderer = require('./Renderer'),
  Sprite = require('./Sprite'),
  Text = require('./Text'),
  Point = require('./Point');

var Shape = require('./Shape');
var Rectangle = require('./Rectangle');
var Circle = require('./Circle');
var Polygon = require('./Polygon');
var _ = require('./utils');

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
        this._renderObject(o);
        this._drawDebug(o);

        if (o.children){

          o.children.each(function(child){
            this._renderObject(child);
            this._drawDebug(child);
          }, this);
        }

      }, this);

    }, this);

  },

  _renderObject: function(o){
    if(o instanceof Sprite){
      this._renderSprite(o);
    }
    else if(o instanceof Text){
      this._renderText(o);
    }
    else if(o instanceof Shape){
      this._renderShape(o);
    }
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

  _renderShape: function(o){
    var ctx = this.context;

    ctx.beginPath();

    this._drawShape(o);

    if (o.fill){
      ctx.fillStyle = o.fill;
      ctx.fill();
    }

    if (o.stroke){
      ctx.lineWidth = o.lineWidth || 1;
      ctx.strokeStyle = o.stroke;
      ctx.stroke();
    }
  },

  _drawShape: function(o, offset){
    var ctx = this.context;

    offset = offset || new Point();
    var pos = o.position.add(offset);

    if (o instanceof Rectangle){
      ctx.rect(pos.x, pos.y, o.size.width, o.size.height);
    }
    else if (o instanceof Circle){
      ctx.arc(pos.x, pos.y, o.radius, 0, 2 * Math.PI, false);
    }
    else if (o instanceof Polygon){
      _.forEach(o.points, function(point, index){

        var p = pos.add(point);
        if(index === 0){
          ctx.moveTo(p.x, p.y);
        }
        else {
          ctx.lineTo(p.x, p.y);
        }
      });
      ctx.closePath();
    }
    else {
      return;
    }

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
  },

  _drawDebug: function(o){

    if (pac.DEBUG && o.shape){
      var ctx = this.context;

      ctx.beginPath();

      this._drawShape(o.shape, o.position);

      ctx.fillStyle = 'rgba(0,255,0,0.4)';

      if (!o.active){
        ctx.fillStyle = 'rgba(255,0,0,0.4)';
      }

      ctx.fill();
    }

  },

});
