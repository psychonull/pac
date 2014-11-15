
var List = require('./List');
var Action = require('./Action');

var ActionList = module.exports = List.extend({

  childType: Action,

  init: function(){
    ActionList.__super__.init.apply(this, arguments);

    this.on('add', this._attachListToAction.bind(this));

    this.each(this._attachListToAction.bind(this));
  },

  _attachListToAction: function(action){
    action.actions = this;
    action.started = false;
  },

  pushFront: function(action){
    this.insertAt(0, action);
  },

  pushBack: function(action){
    this.add(action);
  },

  insertBefore: function(action, before){
    var idx = this.indexOf(before);

    if (idx > -1){
      this.insertAt(idx, action);
    }
  },

  insertAfter: function(action, after){
    var idx = this.indexOf(after);

    if (idx > -1){
      this.insertAt(idx+1, action);
    }
  },

  has: function(ActionType){
    var found = false;

    this.each(function(item){
      if (item instanceof ActionType){
        found = true;
        return false;
      }
    });

    return found;
  },

  update: function(dt){

    this.each(function(action, i){

      if (action){

        this._startAction(action);

        if (!action.started){
          return false; //break loop
        }

        action.update(dt);

        if(action.isFinished) {
          action.onEnd();
          this.remove(action);
        }

        if (action.isBlocking){
          return false; // break loop
        }

      }

    }, this);

  },

  _startAction: function(action){
    if (!action.started && action.resolve()){
      action.onStart();
      action.started = true;
    }
  }

});