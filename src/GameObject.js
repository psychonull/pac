
var Emitter = require('./Emitter');
var ActionList = require('./ActionList');

var GameObject = module.exports = Emitter.extend({

  name: 'GameObject',
  actions: null,

  constructor: function(options){
    this.name = (options && options.name) || this.name;

    if (options && options.actions){

      if (options.actions instanceof ActionList){
        this.actions = options.actions;
      }
      else {
        this.actions = new ActionList(options.actions);
      }

      this.actions.owner = this;
    }

    Emitter.apply(this, arguments);
  },

  init: function(){ },

  update: function(dt) { },

  updateActions: function(dt) {
    if (this.actions){
      this.actions.update(dt);
    }
  }

});

