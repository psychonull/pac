
var Emitter = require('./Emitter'),
  _ = require('./utils');

module.exports = Emitter.extend({

  childType: null,
  length: 0,

  init: function(data, options){
    this._data = {};

    var updateLength = function updateLength(){
      this.length = _.keys(this._data).length;
    };

    this.on('add', _.bind(updateLength, this));
    this.on('remove', _.bind(updateLength, this));
    this.on('clear', _.bind(updateLength, this));

    if(data){
      this.add(data);
    }
  },

  get: function(key){
    var val = this._data[key];

    if(typeof val === 'undefined'){
      return null;
    }
    return val;
  },

  add: function(){
    var arg0 = arguments[0];

    if (typeof arg0 === 'string'){
      this._set(arguments[1], arg0);
      return this;
    }

    _.forIn(arg0, _.bind(this._set, this));

    return this;
  },

  _set: function(value, key){

    if (this.childType && !(value instanceof this.childType)){
      throw new Error('Error on Add: invalid child type of: ' + key);
    }

    if(this.get(key) !== null){
      throw new Error('duplicate key: ' + key);
    }

    this._data[key] = value;

    this.emit('add', value, key);
  },

  remove: function(key){
    var val = this.get(key);

    if (val !== null){
      delete this._data[key];
    }

    this.emit('remove', key, val);
    return val;
  },

  clear: function(){
    this._data = {};
    this.emit('clear');
  },

  each: function(cb, ctx){
    _.forIn(this._data, cb, ctx);
    return this;
  },

  hasKey: function(key){
    return this.get(key) !== null;
  },

});