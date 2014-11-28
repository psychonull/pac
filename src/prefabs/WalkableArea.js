
var Drawable = require('../Drawable');

var GameObjectList = require('../GameObjectList');

var Clickable = require('../actions/Clickable');
var Command = require('../actions/Command');
var WalkTo = require('../actions/WalkTo');
var Point = require('../Point');

var WaitForWalker = require('../actions/WaitForWalker');

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

  moveWalkers: function(toPos, nearness){

    this.walkers.each(function(walker){

      // Clear al WalkTo on the walker,
      // since we are moving to other point
      walker.actions.removeAll(WalkTo);

      walker.actions.pushFront(new WalkTo({
        target: toPos,
        velocity: walker.velocity,
        pivot: walker.feet,
        nearness: nearness || 1
      }));

    });
  },

  moveWalkersToObject: function(obj, nearness, command){

    var cancelCommand = false;
    if (command && this.commands.indexOf(command) > -1){
      cancelCommand = true;
    }

    var toPos = obj.position;

    if (obj.shape && obj.shape.size){
      var size = new Point(obj.shape.size.width/2, obj.shape.size.height);
      toPos = toPos.add(size);
    }

    if (!this.shape.isPointInside(toPos, this.position)){
      // is outside the walkable area
      toPos = this.shape.nearestPoint(toPos, this.position);
    }

    /* START - NOT TESTED */
    var walker = this.walkers.get(0);
    if (obj.actions && walker){
      obj.actions.pushFront(new WaitForWalker({
        walker: walker
      }));
    }
    /* END - NOT TESTED */

    this.moveWalkers(toPos, nearness);

    return cancelCommand;
  },

  addWalker: function(walker){
    this.walkers.add(walker);
  },

  removeWalker: function(walker){
    this.walkers.remove(walker);
  },

  clearWalkers: function(){
    this.walkers.clear();
  }

});
