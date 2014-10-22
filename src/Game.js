
var Emitter = require('./Emitter');

var Game = module.exports = Emitter.extend({

  start: function(){

  }

}, {

  create: function(){
    return new Game();
  }

});
