
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  container: null,

  constructor: function(options){
    this.container = (window && window.document) || null;
    this.enabled = false;

    if (options){
      this.container = options.container || this.container;
      this.enabled = options.enabled || this.enabled;
    }

    Emitter.apply(this, arguments);
  },

  init: function(options) { },

  enable: function(){
    this.enabled = true;
  },

  disable: function(){
    this.enabled = false;
  }

}, {

  events: {
    MOVE: 'cursor:move',
    DOWN: 'cursor:down',
    UP: 'cursor:up'
  }

});