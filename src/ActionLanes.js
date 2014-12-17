
var MapList = require('./MapList');

var ActionLanes = module.exports = MapList.extend({

  length: 0,

  init: function(data, options){
    this.childType = require('./ActionList');
    ActionLanes.__super__.init.apply(this, arguments);

    this.lanes = (options && options.lanes) || [];

    if (this.lanes.length === 0){
      this.each(function(lane, name){
        this.lanes.push(name);
      }, this);
    }

  },

  update: function(dt){
    this.each(function(lane, name){
      lane.update(dt);
    });
  }

}, {

  create: function(lanesArr){
    var lanes = {};
    var ActionList = require('./ActionList');

    if (lanesArr){
      lanesArr.forEach(function(lane){
        lanes[lane] = new ActionList();
      });
    }

    return new ActionLanes(lanes);
  }

});
