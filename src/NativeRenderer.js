
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
  },

  onStageAdd: function(obj){

    var textures = this.game.cache.images;
    
    var texture = textures.get(obj.texture);
    obj.image = texture.image;
    obj.frames = texture.frames;

  },

  onStageClear: function(){
    
  },

  render: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stage.each(function(o){

      if (o.frames){
        var anim = o.animations && o.animations.current;
        var frame = anim && anim.frame;

        if (frame >= 0){
          var frm = o.frames.at(frame);
          
          this.context.drawImage(o.image, 
            frm.x, frm.y, frm.width, frm.height,
            o.position.x, o.position.y, o.size.width, o.size.height);
        }
      }
      else {

        this.context.drawImage(o.image, 
          o.position.x, o.position.y, o.size.width, o.size.height);
      }

    }, this);
  }

});
