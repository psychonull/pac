
var Emitter = require('./Emitter');
var ActionList = require('./ActionList');

var GameObject = module.exports = Emitter.extend({

  actions: null,

  constructor: function(options){
    if (options && options.actions){

      if (options.actions instanceof ActionList){
        this.actions = options.actions;
      }
      else {
        this.actions = new ActionList(options.actions);
      }

      this.actions.owner = this;
    }
  
    //GameObject.__super__.constructor.apply(this, arguments);
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

