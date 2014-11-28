
var Action = require('../Action');
var Point = require('../Point');

module.exports = Action.extend({

  name: 'Walker',

  init: function(options) {
    this.area = (options && options.area) || 'WalkableArea';
    this.velocity = (options && options.velocity) || 10;
    this.feet = (options && options.feet) || null;
  },

  onStart: function() {
    var obj = this.actions.owner;
    var game = obj.game;

    this.walkableArea = game.findOne(this.area);

    if (!this.walkableArea){
      this.isFinished = true;
      return;
      //throw new Error('A WalkableArea with name [' + this.area +
      //  '] was not found.');
    }

    if (!this.feet){
      this._findFeet(obj);
    }

    obj.velocity = this.velocity;
    obj.feet = this.feet;

    this.walkableArea.addWalker(obj);
  },

  _findFeet: function(obj){

    if (obj.shape && obj.shape.size){
      this.feet = new Point(obj.shape.size.width/2, obj.shape.size.height);
      return;
    }

    if (obj.size){
      this.feet = new Point(obj.size.width/2, obj.size.height);
      return;
    }

    this.feet = new Point();
  },

  onEnd: function() {

    if (this.walkableArea){
      var obj = this.actions.owner;
      this.walkableArea.removeWalker(obj);
    }
  },

  update: function(dt) { }

});