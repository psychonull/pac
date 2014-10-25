
var Renderer = require('./Renderer');

var NativeRenderer = module.exports = Renderer.extend({

  size: { width: 800, height: 600 },
  backgroundColor: '#000000',

  init: function(){
    NativeRenderer.__super__.init.apply(this, arguments);

    var canvas = document.createElement('canvas');
    
    canvas.style.backgroundColor = this.backgroundColor;
    canvas.width = this.size.width;
    canvas.height = this.size.height;

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.container.appendChild(this.canvas);
  },

  onStageAdd: function(obj){
    (function(o){

      var res = new Image();
      
      res.onload = function(){
        o.image = res;
      };

      res.src = o.resource;

    })(obj);
  },

  onStageClear: function(){
    
  },

  render: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.stage.entities.forEach(function(e){
      if (e.image){
        this.context.drawImage(e.image, 
          e.position.x, e.position.y, e.size.width, e.size.height);
      }
    }, this);
  }

});
