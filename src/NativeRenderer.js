
var Renderer = require('./Renderer');

var NativeRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    NativeRenderer.__super__.init.apply(this, arguments);

    var canvas = document.createElement('canvas');
    
    canvas.backgroundColor = this.backgroundColor;
    canvas.width = this.size.width;
    canvas.height = this.size.height;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.container.appendChild(this.canvas);
  },

  onStageAdd: function(obj){
    
  },

  onStageClear: function(){
    
  },

  render: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

/*
    this.stage.entities.forEach(function(entity){
      this.context.drawImage(entity);
    }, this);
*/
  }

});
