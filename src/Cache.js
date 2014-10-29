
var Emitter = require('./Emitter'),
  _ = require('./utils');

var Cache = Emitter.extend({

  length: 0,
  _validation: function(val) { return true; },
  childType: null,

  init: function(data, options){
    this._data = {};

    var updateLength = function updateLength(){
      this.length = _.keys(this._data).length;
    };

    this.on('add', _.bind(updateLength, this));
    this.on('remove', _.bind(updateLength, this));

    this._groups = { length: 0 };

    if(options && options.validation){
      this.setValidation(options.validation);
    }

    if(options && options.groups){
      _.forEach(options.groups, _.bind(function(groupName){
        this.addGroup(groupName);
      }, this));
    }

    if(data){
      this._initData(data);
    }
  },

  _initData: function(data){
    _.forIn(data, _.bind(function(value, key){
      this._add(key, value);
    }, this));
  },

  add: function(){
    var arg0 = arguments[0];

    if (arguments.length === 1){

      if(Array.isArray(arg0)){
        arg0.forEach(function(ele){
          this._add(ele.cid, ele);
        }, this);

        return this;
      }

      this._add(arg0.cid, arg0);

      return this;
    }

    this._add(arg0, arguments[1]);

    return this;
  },

  _add: function(key, value){

    if (this.childType && !(value instanceof this.childType)){
      throw new Error('Error on Add: invalid child type of: ' + key);
    }

    if(this.get(key) !== null){
      throw new Error('Cache duplicate key: ' + key);
    }

    this.validate(value);
    this._data[key] = value;

    this.emit('add', key, value);
  },

  get: function(key){
    if(typeof key === 'undefined'){
      return this._data;
    }
    var val = this._data[key];

    if(typeof val === 'undefined'){
      return null;
    }
    return val;
  },

  remove: function(key){
    var val = this.get(key);

    if (val !== null){
      delete this._data[key];
    }

    this.emit('remove', key, val);
    return val;
  },

  hasKey: function(key){
    return this.get(key) !== null;
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

  addGroup: function(name, data, options){
    var group = new Cache(data, options);

    if(this._groups.length === 0){
      this._groups = new Cache();
    }

    this._groups.add(name, group);
    return group;
  },

  getGroup: function(name){
    if (this._groups.length === 0){
      this._groups = new Cache();
    }
    return this._groups.get(name);
  },

  hasGroup: function(name){
    return this.getGroup(name) !== null;
  },

  values: function(){
    return _.values(this._data);
  }

});

module.exports = Cache;
