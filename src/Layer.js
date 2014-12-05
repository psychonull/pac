
var List = require('./List');
var GameObject = require('./GameObject');

var Layer = module.exports = List.extend({

  childType: GameObject,
  comparator: 'zIndex',

  init: function(){
    Layer.__super__.init.apply(this, arguments);

    this
      .on('add', this._onAdd.bind(this))
      .on('remove', this._onRemove.bind(this));
  },

  _onAdd: function(obj){
    var self = this;

    obj.on('change:zIndex', function(newValue, oldValue){
      self._sort();
      self.emit('change:zIndex', this);
    });
  },

  _onRemove: function(obj){
    obj.removeAllListeners('change:zIndex');
  },

  clear: function(){
    this.each(function(obj){
      obj.removeAllListeners('change:zIndex');
    });

    Layer.__super__.clear.apply(this, arguments);
  }

});
