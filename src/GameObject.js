
var Emitter = require('./Emitter');
var ActionList = require('./ActionList');

var GameObject = module.exports = Emitter.extend({

  name: 'GameObject',
  active: true,
  actions: null,

  constructor: function(options){
    this.name = (options && options.name) || this.name;
    this.active = (options && options.active) || this.active;
    this.actions = (options && options.actions) || this.actions;

    if (this.actions){

      if (Array.isArray(this.actions)){
        this.actions = new ActionList(this.actions);
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
  },

  onEnterScene: function(){}

});

