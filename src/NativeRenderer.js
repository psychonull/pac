
var Renderer = require('./Renderer');

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

      var textures = this.game.cache.images;

      var texture = textures.get(obj.texture);
      obj.image = texture.raw();
      obj.frames = texture.frames;

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

      }, this);

    }, this);

  }

});
