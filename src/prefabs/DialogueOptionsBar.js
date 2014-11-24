
var Rectangle = require('../Rectangle');

var Point = require('../Point');
var _ = require('../utils');

var Hoverable = require('../actions/Hoverable');
var Clickable = require('../actions/Clickable');

var Text = require('../Text');

module.exports = Rectangle.extend({

  name: 'DialogueOptionsBar',
  size: { width: 100, height: 100 },

  style: { },
  optionSelectedCb: null,

  constructor: function(options){

    var props = [
      'style'
    ];

    function setProp(prop){
      this[prop] = (options && options[prop]) || this[prop];
    }

    props.forEach(setProp.bind(this));

    Rectangle.apply(this, arguments);

    this.active = false;
    this.visible = false;
  },

  init: function() {},

  showOptions: function(options, cb){
    _.forEach(options, function(option, i){
      var optOptions = _.clone(this.style.text, true) || { fill: '#000' };

      _.extend(optOptions, {
        value: option.value,
        position: this._getOptionPosition(i),
        shape: new Rectangle({ size: this.style.size }),
        actions: [ new Hoverable(), new Clickable() ]
      });

      var opt = new Text(optOptions);
      opt.code = option.code;

      opt
        .on('hover:in', this.onOptionHoverIn.bind(this, opt))
        .on('hover:out', this.onOptionHoverOut.bind(this, opt))
        .on('click', this.onOptionClick.bind(this, opt));

      this.children.add(opt);
    }, this);

    this.optionSelectedCb = cb;

    this.active = true;
    this.visible = true;
  },

  update: function(dt) {},

  onEnterScene: function(){},

  _getOptionPosition: function(index){
    var x = (this.style.margin && this.style.margin.x) || 0;
    var marginY = (this.style.margin && this.style.margin.y) || 0;
    var y = marginY * (index + 1) + (this.style.size.height * index);
    return new Point(x, y);
  },

  onOptionHoverIn: function(option){
    _.extend(option, this.style.hover);
  },

  onOptionHoverOut: function(option){
    _.extend(option, this.style.text);
  },

  onOptionClick: function(option){
    this.onOptionSelected(option.code);
  },

  onOptionSelected: function(code){
    this.active = false;
    this.visible = false;
    this.optionSelectedCb(code);

    //HACK: remove individually instead of clearing to avoid renderer issue
    var optionCids = _.map(this.children._items, function(item){
      return {
        cid: item.cid
      };
    });
    _.forEach(optionCids, function(cidObj){
      this.children.remove(cidObj);
    }, this);
  }

});
