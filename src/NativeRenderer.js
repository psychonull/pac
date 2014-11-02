
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
    
    var image = textures.get(obj.texture).image;
    obj.image = image;

  },

  onStageClear: function(){
    
  },

  render: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stage.each(function(e){
      if (e.image){
        this.context.drawImage(e.image, 
          e.position.x, e.position.y, e.size.width, e.size.height);
      }
    }, this);
  }

});
