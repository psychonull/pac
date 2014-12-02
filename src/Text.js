
var GameObject = require('./GameObject');
var Point = require('./Point');
var _ = require('./utils');

var Text = module.exports = GameObject.extend({

  name: 'Text',
  value: '',
  font: '20px Arial',
  fill: 'black',
  stroke: 'black',
  strokeThickness: 0,
  wordWrap: 0,
  isBitmapText: false,
  wrapToScreen: false,

  constructor: function(arg0, arg1){
    var args = this._extractConstructorArgs(arguments);

    this.value = args.value || this.value;

    if(args.options){
      var optionsWhitelist = ['font', 'fill', 'stroke',
        'strokeThickness', 'wordWrap', 'isBitmapText', 'tint', 'wrapToScreen'];
      _.extend(this, _.pick(args.options, optionsWhitelist));
    }

    GameObject.apply(this, [args.options]);
  },

  _extractConstructorArgs: function(args){
    var value, options;
    //support "value", "value, options", "options"
    if(typeof args[0] === 'string'){
      value = args[0];
      options = args[1];
    }
    else if(typeof args[0] === 'object'){
      options = args[0];
      value = options.value;
    }
    return {
      value: value,
      options: options
    };
  },

  init: function(){ },

  update: function(dt) { }

});
