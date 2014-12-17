
var MapList = require('./MapList');
var Action = require('./Action');

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
  },

  insertAt: function(){
    var arg0 = arguments[0],
      arg1 = arguments[1],
      arg2 = arguments[2];

    if (typeof arg0 === 'string'){
      this.insertAction(arg1, arg2, arg0);
    }

    if (typeof arg0 === 'number'){
      this.insertAction(arg0, arg1);
    }

    return this;
  },

  insertAction: function(idx, action, lane){
    var ActionList = require('./ActionList');

    if (!lane){
      lane = action.lane;
    }

    if (lane){
      if (!this.hasKey(lane)){
        this.add(lane, new ActionList());
      }

      this.get(lane).insertAt(idx, action);
    }
  },

  addAction: function(action, lane){
    var ActionList = require('./ActionList');

    if (!lane){
      lane = action.lane;
    }

    if (lane){
      if (!this.hasKey(lane)){
        this.add(lane, new ActionList());
      }

      this.get(lane).add(action);
    }

    /*
    else {
      What should do?
    }
    */
  },

  add: function(){
    var arg0 = arguments[0],
      arg1 = arguments[1];

    if(Array.isArray(arg0)){
      arg0.forEach(this.addAction.bind(this));
      return this;
    }

    if (arg0 instanceof Action){
      this.addAction(arg0);
      return this;
    }

    if (arg1 instanceof Action){
      this.addAction(arg1, arg0);
      return this;
    }

    // Add for Lanes
    ActionLanes.__super__.add.apply(this, arguments);
    return this;
  },

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
