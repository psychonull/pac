
var Emitter = require('./Emitter'),
  _ = require('./utils');

var List = module.exports = Emitter.extend({

  childType: null,
  length: 0,

  init: function(items, options){

    if (items && !Array.isArray(items)){
      throw new Error('invalid argument, expected an array');
    }

    this._items = [];
    this.length = 0;

    if (items && items.length > 0){
      items.forEach(this._set.bind(this));
    }
  },

  at: function(index){
    return this._items[index];
  },

  get: function(cid){
    return _.find(this._items, { 'cid': cid });
  },

  add: function(){
    var arg0 = arguments[0];

    if(Array.isArray(arg0)){
      arg0.forEach(this._set.bind(this));
      return this;
    }

    if (arg0 instanceof List){
      arg0.each(this._set.bind(this));
      return this; 
    }

    this._set(arg0);
    return this;
  },

  _set: function(item){

    if (this.childType && !(item instanceof this.childType)){
      throw new Error('invalid child type');
    }

    if (this.get(item.cid)){
      //already exists
      return;
    }

    this._items.push(item);
    this.length++;

    this.emit('add', item);
  },

  remove: function(){
    var arg0 = arguments[0], 
      cid = arg0;

    if (typeof arg0 === 'object'){
      cid = arg0.cid;
    }

    var removed = _.remove(this._items, function(item) { 
      return item.cid === cid; 
    });

    if (removed.length > 0){
      this.length -= removed.length;
      this.emit('remove', removed[0]);
    }
  },

  clear: function(){
    this._items.length = 0;
    this.length = 0;

    this.emit('clear');
    return this;
  },

  each: function(cb, ctx){
    _.forEach(this._items, cb, ctx);
    return this;
  }

});