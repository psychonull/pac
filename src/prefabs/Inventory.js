
var Rectangle = require('../Rectangle');

var Point = require('../Point');
var _ = require('../utils');

var Command = require('./Command');
var Text = require('../Text');

module.exports = Rectangle.extend({

  name: 'Inventory',
  size: { width: 100, height: 100 },

  commands: {},
  maxItems: 8,

  style: { },

  constructor: function(options){

    var props = [
      'style',
      'commands',
      'maxItems'
    ];

    function setProp(prop){
      this[prop] = (options && options[prop]) || this[prop];
    }

    props.forEach(setProp.bind(this));

    this.current = null;

    Rectangle.apply(this, arguments);

    this._buildContainer();
  },

  _buildContainer: function(){

    if (!this.style.position){
      this.style.position = new Point();
    }

    _.times(this.maxItems, this._createItemHolder.bind(this));
  },

  _createItemHolder: function(index){
    var holderOpts = _.clone(this.style.holder, true);

    _.extend(holderOpts, {
      position: this._getPosition(index),
      size: this.style.size
    });

    this.children.add(new Rectangle(holderOpts));
  },

  _rePositionItems: function(){
    if (this.children.length >= this.maxItems){

      for (var i=this.maxItems; i<this.children.length; i++){
        var pos = i - this.maxItems;

        var item = this.children.at(i);
        item.localPosition = this._getPosition(pos);
        item.position = this.position.add(item.localPosition);
      }
    }
  },

  _getPosition: function(position){
    var size = this.style.size,
      margin = this.style.margin,
      itemsPerRow = this.style.itemsPerRow,
      rows = Math.floor(this.maxItems / itemsPerRow),
      x = 0, y = 0;

    for(var row=0; row<rows; row++){
      for(var col=0; col<itemsPerRow; col++){
        if (col + (row*itemsPerRow) === position){
          y = row; x = col; break;
        }
      }
    }

    x = (x * size.width) + (x * margin.x) + margin.x;
    y = (y * size.height) + (y * margin.y) + margin.y;

    var offset = this.style.position;
    return new Point(x + offset.x, y + offset.y);
  },

  has: function(itemName){
    var found = this.children.findOne(itemName);
    return (found && true) || false;
  },

  add: function(item){
    var pos = this.children.length - this.maxItems;

    item.position = this._getPosition(pos);
    item.size = this.style.size;

    item.shape = new Rectangle({ size: this.style.size });

    item.isInInventory = true;

    this.children.add(item);
  },

  remove: function(itemName){
    var found = this.children.findOne(itemName);
    if (found){
      found.isInInventory = false;
      this.children.remove(found);
      this._rePositionItems();
    }
  },

  init: function() {},

  update: function(dt) {},

  onEnterScene: function(){
    this.current = null;
  }

});
