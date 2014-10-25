
var EngineComponent = require('./EngineComponent');
var Cache = require('./Cache');

module.exports = EngineComponent.extend({

  // events: start, progress, complete
  // events: start:group, progress:group, complete:group
  init: function(game){
    this.game = game;
    if(!this.game.cache){
      this.game.cache = new Cache();
    }
  }
  // some inspiration:
  //http://www.goodboydigital.com/pixijs/docs/classes/AssetLoader.html
  //https://github.com/andrewrk/chem/blob/master/lib/resources.js
  //http://docs.phaser.io/Loader.js.html
  //http://docs.phaser.io/Cache.js.html
});
