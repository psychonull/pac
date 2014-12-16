
var WrappedObject = require('./WrappedObject'),
  Action = require('./Action'),
  _ = require('./utils');

var WrappedAction = module.exports = WrappedObject.extend({

  childType: Action,
  length: 0,

  init: function(){
    WrappedAction.__super__.init.apply(this, arguments);
    this._overrideMethods();
  },

  _overrideMethods: function(){

    var methods = [
      'insertAbove',
      'insertBelow',
      'block',
      'unblock',
      'blockOnce',
      'remove',
      'moveUp',
      'moveDown',
      'moveTop',
      'moveBottom',
      'moveTo'
    ];

    _.forEach(methods, function(method){
      this[method] = this._getChainedMethod(method);
    }, this);

    var methodsOne = [
      'index'
    ];

    _.forEach(methodsOne, function(method){
      this[method] = this._getOnlyFirstMethod(method);
    }, this);
  },

  _getChainedMethod: function(method){
    var self = this;

    return function(){
      var args = [].slice.apply(arguments);

      self.each(function(action){

        try {
          action[method].apply(action, args);
        } catch(e) { /* do nothing */ }

      });

      return self;
    };

  },

  _getOnlyFirstMethod: function(method){
    var self = this;

    return function(){
      var args = [].slice.apply(arguments);

      if (self.length > 0){
        var action = self.at(0);
        return action[method].apply(action, args);
      }

      return;
    };

  },

  index: function() {},

  // Chained

  moveUp: function() {},
  moveDown: function() {},
  moveTop: function() {},
  moveBottom: function() {},
  moveTo: function(index) {},

  block: function() {},
  unblock: function() {},
  blockOnce: function() {},
  remove: function() {},

  insertAbove: function(action) {},
  insertBelow: function(action) {},

});
