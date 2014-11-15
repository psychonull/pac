
var Drawable = require('../Drawable');

var GameObjectList = require('../GameObjectList');

var Clickable = require('../actions/Clickable');
var Command = require('../actions/Command');
var WalkTo = require('../actions/WalkTo');

module.exports = Drawable.extend({

  name: 'WalkableArea',
  shape: null,
  commands: null,

  constructor: function(options){
    this.shape = (options && options.shape) || this.shape;
    this.commands = (options && options.commands) || this.commands;

    if (!this.shape){
      throw new Error('expected a shape');
    }

    this._buildActions();
    this.walkers = new GameObjectList();

    Drawable.apply(this, arguments);
  },

  _buildActions: function(){
    if (this.commands && this.commands.length > 0){
      this.actions = [ new Command() ];

      this.onCommand = { };
      this.commands.forEach(function(cmd){
        this.onCommand[cmd] = this._onAreaMove.bind(this);
      }, this);

      return;
    }

    this.actions = [ new Clickable() ];
    this.on('click', this._onAreaMove.bind(this));
  },

  _onAreaMove: function(){
    var pos = this.game.inputs.cursor.position;
    this.moveWalkers(pos);
  },

  moveWalkers: function(toPos){

    this.walkers.each(function(walker){

      // Clear al WalkTo on the walker,
      // since we are moving to other point
      walker.actions.removeAll(WalkTo);

      walker.actions.pushFront(new WalkTo({
        target: toPos,
        velocity: walker.velocity
      }));

    });
  },

  addWalker: function(walker){
    this.walkers.add(walker);
  },

  removeWalker: function(walker){
    this.walkers.remove(walker);
  }

});
