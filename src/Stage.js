
var Emitter = require('./Emitter');

module.exports = Emitter.extend({

  init: function(){
    this.entities = [];
  },

  add: function(entity){
    this.entities.push(entity);
    this.emit('add', entity);
  },

  clear: function(){
    this.entities = [];
    this.emit('clear');
  }

});
