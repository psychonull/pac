
var MapList = require('./MapList');
var Input = require('./Input');

var MouseInput = require('./MouseInput');
var Point = require('./Point');

var InputManager = module.exports = MapList.extend({

  childType: Input,

  init: function(data, options){
    InputManager.__super__.init.apply(this, arguments);

    this.cursor = {
      position: new Point(),
      isDown: false
    };

    this._down = false;
    this.prevDown = false;
    this._up = false;

    this.on('add', this._attachEvents.bind(this));
    this.each(this._attachEvents.bind(this));
  },

  _attachEvents: function(input, type){
    var self = this;

    input
      .on(Input.events.MOVE, function(position){
        self.cursor.position = position;
      })
      .on(Input.events.DOWN, function(){
        self._down = true;
        self._up = false;
      })
      .on(Input.events.UP, function(){
        self._up = true;
        self._down = false;
      });
  },

  update: function(dt){
    this.cursor.isDown = this._down;

    if (this.prevDown && this.cursor.isDown){
      this.prevDown = this.cursor.isDown = this._down = false;
    }
    else {
      this.prevDown = this.cursor.isDown;
    }

    if (this._up){
      this.cursor.isDown = false;
      this._up = false;
    }
  },

  enable: function(){
    this.each(function(input){
      input.enable();
    });
  },

  disable: function(){
    this.each(function(input){
      input.disable();
    });
  }

}, {

  create: function(inputs, options){
    var data = {};

    if (inputs) {

      if (!Array.isArray(inputs)){
        inputs = [inputs];
      }

      inputs.forEach(function(InputClass){

        var input = new InputClass(options);
        if (input instanceof MouseInput){
          data.mouse = input;
        }
      });
    }

    return new InputManager(data);
  }

});
