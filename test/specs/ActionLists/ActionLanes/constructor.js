
var ActionLanes = require('../../../../src/ActionLanes');
var ActionList = require('../../../../src/ActionList');
var MapList = require('../../../../src/MapList');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init a MapList object', function(){
    expect(ActionLanes.prototype).to.be.an.instanceof(MapList);

    var lanes = new ActionLanes();
    expect(lanes.childType).to.be.equal(ActionList);
    expect(lanes.length).to.be.equal(0);
  });

});

describe('ActionLanes.create', function(){

  it('should init an ActionLanes with an array of Lanes', function(){
    expect(ActionLanes.create).to.be.a('function');

    var actionLanes = ActionLanes.create([ 'lane1', 'lane2' ]);

    expect(actionLanes.length).to.be.equal(2);

    expect(actionLanes.lanes).to.be.an('array');
    expect(actionLanes.lanes[0]).to.be.equal('lane1');
    expect(actionLanes.lanes[1]).to.be.equal('lane2');
    var lane1 = actionLanes.get('lane1');
    expect(lane1).to.be.an.instanceof(ActionList);

    var lane2 = actionLanes.get('lane2');
    expect(lane2).to.be.an.instanceof(ActionList);
  });

});