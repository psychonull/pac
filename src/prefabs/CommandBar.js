
var Rectangle = require('../Rectangle');

var GameObjectList = require('../GameObjectList');

var Point = require('../Point');
var _ = require('../utils');

var Hoverable = require('../actions/Hoverable');
var Clickable = require('../actions/Clickable');

var Command = require('./Command');
var Text = require('../Text');

module.exports = Rectangle.extend({

  name: 'CommandBar',
  size: { width: 100, height: 100 },

  cannotHolder: 'Cannot {{action}} that',

  commands: {},
  current: null,

  inventory: null,
  inventoryCommands: { },

  messageBox: { },
  style: { },

  constructor: function(options){

    var props = [
      'style',
      'cannotHolder',
      'commands',
      'messageBox',
      'current',
      'inventory',
      'inventoryCommands'
    ];

    function setProp(prop){
      this[prop] = (options && options[prop]) || this[prop];
    }

    props.forEach(setProp.bind(this));
    this.default = this.current;

    Rectangle.apply(this, arguments);

    this._buildContainer();
  },

  _buildContainer: function(){

    this.messageBox = new Text(_.clone(this.messageBox, true));
    this.children.add(this.messageBox);

    if (!this.style.position){
      this.style.position = new Point();
    }

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

    var offset = this.style.position;
    return new Point(x + offset.x, y + offset.y);
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

    if (this.setCommand(cmd)) {
      this.emit('command', cmd);
    }
  },

  setCommand: function(commandName){

    if (commandName === this.current){
      return;
    }

    var cmd = this.children.findOne({ command: commandName });

    if (cmd){

      if (this._current){
        this._setCommandStyle(this._current, this.style.text);
      }

      this.current = commandName;
      this._current = cmd;

      this._setCommandStyle(cmd, this.style.active);
      return true;
    }

    return false;
  },

  _getJoin: function(){
    if (this.inventory && this.inventory.current){
      var invCmds = this.inventoryCommands;
      return invCmds[this.current];
    }

    return null;
  },

  _isCommandDisabled: function(obj){
    return (obj && obj.onCommand && obj.onCommand[this.current] === false);
  },

  _isCommandHidden: function(obj){
    if (obj && obj.hasOwnProperty('hiddenCommands')){

      if (obj.hiddenCommands === true){
        return true;
      }

      if (Array.isArray(obj.hiddenCommands) &&
        obj.hiddenCommands.indexOf(this.current) > -1){
        return true;
      }
    }

    return false;
  },

  showHoverMessage: function(obj){

    if (this._isCommandDisabled(obj) || this._isCommandHidden(obj)){
      return;
    }

    var cmdValue = this._current.value,
      name = obj.name,
      cmdCode = this.current,
      join = this._getJoin();

    var message = join ? name + ' ' + join : name;

    if (join && this.inventory.current !== name){
      message = this.inventory.current + ' ' + join + ' ' + name;
    }

    this.messageBox.value = cmdValue + ' ' + message;
    this.lastRequestOf = obj.cid;
  },

  hideHoverMessage: function(obj){
    if (this._isCommandDisabled(obj) || this._isCommandHidden(obj)){
      return;
    }

    if (this._getJoin()){
      return;
    }

    if (obj && this.lastRequestOf && this.lastRequestOf !== obj.cid){
      return;
    }

    this.messageBox.value = '';
  },

  showCannotMessage: function(obj, message){
    if (this._isCommandDisabled(obj) || this._isCommandHidden(obj)){
      return;
    }

    this.lastRequestOf = (obj && obj.cid) || null;

    if (!message){
      message = this.cannotHolder.replace(/{{action}}/ig, this._current.value);
    }

    this.messageBox.value = message;
  },

  init: function() {},

  update: function(dt) {},

  resetCommand: function(){
    if (this.default){
      this.setCommand(this.default);
    }
  },

  onEnterScene: function(){
    this.resetCommand();

    this.inventory.current = null;
    this.lastRequestOf = null;
    this.hideHoverMessage();
  }

});
