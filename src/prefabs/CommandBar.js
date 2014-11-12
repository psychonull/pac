
var Rectangle = require('../Rectangle');

var GameObjectList = require('../GameObjectList');

var Point = require('../Point');
var _ = require('../utils');

var Hoverable = require('../actions/Hoverable');
var Clickable = require('../actions/Clickable');

var Command = require('./Command');

module.exports = Rectangle.extend({

  size: { width: 100, height: 100 },

  cannotHolder: 'Cannot {{action}} that',

  commands: {},
  current: null,

  style: { },

  constructor: function(options){

    var props = [
      'style',
      'cannotHolder',
      'commands',
      'current'
    ];

    function setProp(prop){
      this[prop] = (options && options[prop]) || this[prop];
    }

    props.forEach(setProp.bind(this));

    Rectangle.apply(this, arguments);

    this._buildChildren();
  },

  _buildChildren: function(){

    _.forIn(this.commands, function(value, key){

      var cmd = this._createCommand(value, key);
      this.children.add(cmd);

      if (key === this.current){
        this._current = cmd;
      }

    }, this);
  },

  _createCommand: function(value, key){
    var commOpts = _.clone(this.style.text, true) || { fill: '#000' };

    if (key === this.current){
      commOpts = _.clone(this.style.active, true) || {};
    }

    _.extend(commOpts, {
      command: key,
      value: value,

      position: this._getPosition(key),
      shape: new Rectangle({ size: this.style.size }),
      actions: [ new Hoverable(), new Clickable() ]
    });

    var command = new Command(commOpts);

    command
      .on('hover:in', this.onCommandHoverIn.bind(this, command))
      .on('hover:out', this.onCommandHoverOut.bind(this, command))
      .on('click', this.onCommandClick.bind(this, command));

    return command;
  },

  _getPosition: function(command){

    var size = this.style.size,
      margin = this.style.margin,
      grid = this.style.grid,
      x = 0, y = 0;

    for(var i=0; i<grid.length; i++){
      var row = grid[i];

      for(var j=0; j<row.length; j++){

        if (row[j] === command){
          y = i; x = j; break;
        }
      }
    }

    x = (x * size.width) + (x * margin.x) + margin.x;
    y = (y * size.height) + (y * margin.y) + margin.y;

    return new Point(x, y);
  },

  _setCommandStyle: function(command, style){
    _.forIn(style, function(value, prop){
      command[prop] = value;
    });
  },

  onCommandHoverIn: function(command){
    if (this.current !== command.command){
      this._setCommandStyle(command, this.style.hover);
    }
  },

  onCommandHoverOut: function(command){
    if (this.current !== command.command){
      this._setCommandStyle(command, this.style.text);
    }
  },

  onCommandClick: function(command){
    var cmd = command.command;

    if (this.current !== cmd){
      if (this._current){
        this._setCommandStyle(this._current, this.style.text);
      }

      this.current = cmd;
      this._current = command;

      this._setCommandStyle(command, this.style.active);
      this.emit('command', cmd);
    }
  },

  init: function() {},

  update: function(dt) {},

});
