
var Emitter = require('./Emitter'),
  _ = require('./utils');

var Cache = Emitter.extend({

  length: 0,
  _validation: function(val) { return true; },

  init: function(data, validationFn){
    this._data = {};

    var updateLength = function updateLength(){
      this.length = _.keys(this._data).length;
    };

    this.on('add', _.bind(updateLength, this));
    this.on('remove', _.bind(updateLength, this));

    this.groups = { length: 0 };

    if(validationFn){
      this.setValidation(validationFn);
    }

    if(data){
      this._initData(data);
    }
  },

  _initData: function(data){
    _.forIn(data, _.bind(function(value, key){
      this.add(key, value);
    }, this));
  },

  add: function(name, element){
    if(this.get(name) !== null){
      throw new Error('Cache duplicate key: ' + name);
    }
    this.validate(element);
    this._data[name] = element;
    this.emit('add', name, element);
  },

  get: function(name){
    var val = this._data[name];
    if(typeof val === 'undefined'){
      return null;
    }
    return val;
  },

  remove: function(name){
    var val = this.get(name);
    if (val !== null){
      delete this._data[name];
    }
    this.emit('remove', name, val);
    return val;
  },

  hasKey: function(name){
    return this.get(name) !== null;
  },

  validate: function(value) {
    var result = this._validation.call(this, value);
    if(result === false){
      throw new Error('validation error');
    }
    else if(typeof result === 'string'){
      throw new Error('validation error: ' + result);
    }
    return result;
  },

  setValidation: function(fn) {
    if(typeof fn !== 'function'){
      throw new Error('Invalid Argument: validationFn must be a function');
    }
    this._validation = fn;
  },

  addGroup: function(name, data, validationFn){
    var group = new Cache(data, validationFn);
    if(this.groups.length === 0){
      this.groups = new Cache();
    }
    this.groups.add(name, group);
    return group;
  },

  getGroup: function(name){
    if (this.groups.length === 0) return null;
    return this.groups.get(name);
  },

  hasGroup: function(name){
    return this.getGroup(name) !== null;
  }

});

module.exports = Cache;
