
var List = require('./List');
var GameObject = require('./GameObject');

module.exports = List.extend({

  childType: GameObject,

  update: function(dt){

    this.each(function(gameObject){

      if (gameObject){

        if (gameObject.game && gameObject.game.loadingScene){
          return false; // break loop
        }

        if (gameObject.updateHierarchy){
          gameObject.updateHierarchy(dt);
        }

        gameObject.updateActions(dt);
        gameObject.update(dt);

        if (gameObject.updateAnimations){
          gameObject.updateAnimations(dt);
        }
      }

    });

  },


});
