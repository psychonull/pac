
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

  removeAll: function(ActionType){
    var itemsToRemove = [];

    this.each(function(item, i){
      if (item instanceof ActionType){
        itemsToRemove.push(item);
      }
    }, this);

    itemsToRemove.forEach(function(action){
      this._endAction(action, true);
    }, this);
    return this;
  },

  update: function(dt){
    var finishedActions = [];

    this.each(function(action, i){

      if (action){

        this._startAction(action);

        if (!action.started){
          return false; //break loop
        }

        action.update(dt);

        if(action.isFinished) {
          this._endAction(action, false);
          finishedActions.push(action);
        }

        //TODO: Check if this should be an ELSE
        //else if (action.isBlocking){

        if (action.isBlocking){
          return false; // break loop
        }

      }

    }, this);

    finishedActions.forEach(function(action){
      this.remove(action);
    }, this);

  },

  _startAction: function(action){
    if (!action.started && action.resolve()){
      action.onStart();
      action.started = true;
    }
  },

  _endAction: function(action, remove){
    if (action.started){
      action.onEnd();
    }

    if (remove){
      this.remove(action);
    }
  }

});