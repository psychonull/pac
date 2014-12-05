
var List = require('./List');
var GameObject = require('./GameObject');

var _ = require('./utils');

var Layer = module.exports = List.extend({

  childType: GameObject,
  comparator: 'zIndex',

  init: function(){
    Layer.__super__.init.apply(this, arguments);

    this
      .on('add', this._onAdd.bind(this))
      .on('remove', this._onRemove.bind(this));

    this.zIndexByCID = {};
  },

  update: function(dt){
    var changed = [];

    this.each(function(obj){

      if (this.zIndexByCID[obj.cid] !== obj.zIndex){
        changed.push(obj);
      }

    }, this);

    if (changed.length > 0){
      this._sort();

      _.forEach(changed, function(obj){

        this.zIndexByCID[obj.cid] = obj.zIndex;
        this.emit('change:zIndex', obj);

      }, this);
    }
  },

  _onAdd: function(obj){
    this.zIndexByCID[obj.cid] = obj.zIndex;
  },

  _onRemove: function(obj){
    delete this.zIndexByCID[obj.cid];
  },

  clear: function(){
    this.zIndexByCID = {};
    Layer.__super__.clear.apply(this, arguments);
  }

});
