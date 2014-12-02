
var Action = require('../Action');
var Point = require('../Point');

module.exports = Action.extend({

  name: 'WalkTo',

  init: function(options) {
    this.target = options && options.target;

    if (!this.target){
      throw new Error('expected a [target] to Walk To');
    }

    this.velocity = (options && options.velocity) || 10;
    this.pivot = (options && options.pivot) || new Point();
    this.nearness = (options && options.nearness) || 1;

    this.isBlocking = true;
  },

  onStart: function() {
    var obj = this.actions.owner;
    this.offset = obj.position.add(this.pivot);
    this.dir = this.target.subtract(this.offset).normalize();

    if (this.target.subtract(this.offset).length() > this.nearness){
      obj.walkingTo = new Point(this.dir);
    }

    obj.targetReached = false;
    obj.emit('walk:start');
  },

  onEnd: function() {
    var obj = this.actions.owner;
    obj.walkingTo = null;
    obj.emit('walk:stop', obj.targetReached);
    obj.targetReached = false;
  },

  update: function(dt) {
    var obj = this.actions.owner;

    if (obj.targetReached){
      this.isFinished = true;
      return;
    }

    if (this.target.subtract(this.offset).length() <= this.nearness){
      obj.targetReached = true;
      return;
    }

    var m = this.velocity * dt;
    var move = new pac.Point(m * this.dir.x, m * this.dir.y);

    this.offset = this.offset.add(move);
    obj.position = this.offset.subtract(this.pivot);

    //TODO: check parseInt (wont work nice on a big scale)
    //obj.position.x = parseInt(obj.position.x, 10);
    //obj.position.y = parseInt(obj.position.y, 10);
  }

});