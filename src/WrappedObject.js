
var List = require('./List'),
  _ = require('./utils');

var WrappedObject = module.exports = List.extend({

  childType: null,
  length: 0,

  init: function(){
    WrappedObject.__super__.init.apply(this, arguments);
  },

  prop: function(){
    var arg0 = arguments[0],
      value = arguments[1];

    if (typeof arg0 === 'string'){

      if (value !== undefined){
        var props = {};
        props[arg0] = value;
        this._setProperties(props);

        return this;
      }

      if (this.length === 0){
        return undefined;
      }

      return this.at(0)[arg0];
    }
    else if (typeof arg0 === 'object'){
      this._setProperties(arg0);
    }

    return this;
  },

  _setProperties: function(props){

    if (this.length === 0){
      return;
    }

    _.forIn(props, function(value, prop){

      this.each(function(obj){
        obj[prop] = value;
      });

    }, this);
  },

  removeProp: function(prop){
    this.each(function(obj){
      delete obj[prop];
    });

    return this;
  }

});
