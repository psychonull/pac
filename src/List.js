
var Emitter = require('./Emitter'),
  _ = require('./utils');

var List = module.exports = Emitter.extend({

  childType: null,
  length: 0,

  comparator: null,

  init: function(items, options){

    if (items && !Array.isArray(items) && (!(items instanceof List)) ){
      throw new Error('invalid argument, expected an array or List');
    }

    this._items = [];
    this.length = 0;

    this.comparator = (options && options.comparator) || this.comparator;

    if (items instanceof List){
      items.each(this._set.bind(this));
    }
    else if (items && items.length > 0){
      items.forEach(this._set.bind(this));
    }
  },

  at: function(index){
    return this._items[index];
  },

  indexOf: function(){
    var arg0 = arguments[0],
      cid = arg0;

    if (typeof arg0 === 'object'){
      cid = arg0.cid;
    }

    for(var i=0; i<this._items.length; i++){
      if (this._items[i].cid === cid){
        return i;
      }
    }

    return -1;
  },

  get: function(cid){
    if(typeof cid === 'number'){
      return this.at(cid);
    }
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

  insertAt: function(index, item){

    if (isNaN(index)){
      throw new Error('expected an index');
    }

    this._validate(item);

    if (this._exists(item)){
      throw new Error('item already exists');
    }

    this._items.splice(index, 0, item);
    this.length++;

    this.emit('add', item);

    return this;
  },

  _validate: function(item){
    if (this.childType && !(item instanceof this.childType)){
      throw new Error('invalid child type');
    }

    if(!item.hasOwnProperty('cid')){
      item.cid = _.uniqueId();
    }
  },

  _exists: function(item){
    if (this.get(item.cid)){
      return true;
    }
    return false;
  },

  _sort: function(){
    var comp = this.comparator;

    if (!comp || (comp && typeof comp !== 'string')){
      return;
    }

    var field = comp.replace('-', ''),
      dir = (comp[0] === '-' ? -1 : 1);

    this._items.sort(function (a, b) {
      var fieldA = a[field], fieldB = b[field];

      if (fieldA < fieldB) return -dir;
      if (fieldA > fieldB) return dir;
      return 0;
    });

  },

  _set: function(item){

    this._validate(item);

    if (this._exists(item)){
      return;
    }

    this._items.push(item);
    this.length++;

    this._sort();

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
    return this;
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
  },

  find: function(search){
    var found;

    if (typeof search === 'function'){
      found = [];

      this.each(function(item){
        if (item instanceof search){
          found.push(item);
        }
      });

      return new List(found);
    }

    if (typeof search === 'string'){
      search = { name: search };
    }

    found = _.filter(this._items, search);
    return new List(found);
  },

  findOne: function(search){
    if (typeof search === 'function'){
      var found;

      this.each(function(item){
        if (item instanceof search){
          found = item;
          return false;
        }
      });

      return found;
    }

    if (typeof search === 'string'){
      search = { name: search };
    }

    return _.find(this._items, search);
  },

  last: function(){
    return _.last(this._items);
  },

  move: function(item, toIndex){
    var fromIndex = this.indexOf(item);
    this._items.splice(toIndex, 0, this._items.splice(fromIndex, 1)[0]);
    return this;
  }

});
