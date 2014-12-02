
var MapList = require('./MapList');
var Input = require('./Input');

var MouseInput = require('./MouseInput');
var Point = require('./Point');

var Stage = require('./Stage');

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
    this.deadClick = false;

    this.on('add', this._attachEvents.bind(this));
    this.each(this._attachEvents.bind(this));

    this._initStages((options && options.layers) || []);
  },

  _initStages: function(layers){
    this.clickStage = Stage.create(layers);
    this.hoverStage = Stage.create(layers);
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

    if (this.clearClick){
      this._clearClicked();
      this.clearClick = false;
      this.deadClick = false;
    }

    if (this.prevDown){
      this._setClicked();
      this.clearClick = true;
    }

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
  },

  _setClicked: function(){
    var objClicked = this.clickStage.getFrontObject();

    if (objClicked){
      objClicked.isClicked = true;
      this.lastClicked = objClicked;
    }
    else {
      this.deadClick = true;
    }
  },

  _clearClicked: function(){
    if (this.lastClicked){
      this.lastClicked.isClicked = false;
      this.lastClicked = null;
    }

    this.clickStage.clearLayer();
  },

  register: function(event, objects){
    switch(event){
      case 'click':
        this.clickStage.addObjects(objects);
        break;
      case 'hover':
        this.hoverStage.addObjects(objects);
        break;
    }
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

    return new InputManager(data, options);
  }

});
