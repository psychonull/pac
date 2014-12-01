
var List = require('./List');

var GameObjectList = module.exports = List.extend({

  //childType: require('./GameObject'),

  init: function(){
    this.childType = require('./GameObject');
    GameObjectList.__super__.init.apply(this, arguments);
  },

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
