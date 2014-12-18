
var ActionLanes = require('../../../../src/ActionLanes');
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');
var WrappedAction = require('../../../../src/WrappedAction');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var ActLane1 = Action.extend({
  lane: 'lane1',
  name: 'Act 1'
});

var ActLane2 = Action.extend({
  lane: 'lane2',
  name: 'Act 2'
});

describe('Methods', function(){

  describe('#add', function(){

    it('must allow to add Lanes', function(){
      var lanes = new ActionLanes();

      var lnX = new ActionList();

      lanes.add('laneX', lnX);

      expect(lanes.length).to.be.equal(1);
      expect(lanes.get('laneX')).to.be.equal(lnX);
    });

    it('must allow to add Actions to a lane', function(){
      var lanes = ActionLanes.create([ 'lane1', 'lane2' ]);

      var act2a = new ActLane2();
      var act2b = new ActLane2();
      var act2c = new ActLane2();

      lanes.add('lane1', act2a);
      lanes.get('lane1').add(act2b);
      lanes.add('lane3', act2c);

      expect(lanes.get('lane1').length).to.be.equal(2);
      expect(lanes.get('lane1').at(0)).to.be.equal(act2a);
      expect(lanes.get('lane1').at(1)).to.be.equal(act2b);

      expect(lanes.get('lane3').length).to.be.equal(1);
      expect(lanes.get('lane3').at(0)).to.be.equal(act2c);
    });

    it('must expose an add method to add actions to lanes', function(){
      var lanes = ActionLanes.create([ 'lane1', 'lane2' ]);

      var act1 = new ActLane1();
      var act2 = new ActLane2();

      lanes.add(act1).add(act2);

      expect(lanes.get('lane1').at(0)).to.be.equal(act1);
      expect(lanes.get('lane2').at(0)).to.be.equal(act2);
    });

  });

  describe('#insertAt', function(){

    it('must allow to insert actions', function(){
      var lanes = ActionLanes.create([ 'lane1' ]);

      var act1 = new ActLane1();
      var act2 = new ActLane1();
      var act3 = new ActLane2();
      var act4 = new ActLane2();

      lanes.insertAt(0, act1); // by action.lane
      lanes.insertAt('lane1', 0, act2); // by lane name

      // No existing lanes
      lanes.insertAt(0, act3); // by lane name
      lanes.insertAt('lane3', 0, act4); // by lane name

      expect(lanes.get('lane1').length).to.be.equal(2);
      expect(lanes.get('lane2').length).to.be.equal(1);
      expect(lanes.get('lane3').length).to.be.equal(1);

      expect(lanes.get('lane1').at(0)).to.be.equal(act2);
      expect(lanes.get('lane1').at(1)).to.be.equal(act1);
      expect(lanes.get('lane2').at(0)).to.be.equal(act3);
      expect(lanes.get('lane3').at(0)).to.be.equal(act4);
    });

  });

  describe('#find', function(){

    it('must allow to find actions across lanes', function(){
      var lanes = ActionLanes.create([ 'lane1', 'lane2' ]);

      var act1 = new ActLane1();
      var act2 = new ActLane1();
      var act3 = new ActLane2();
      var act4 = new ActLane2();

      lanes.add(act1).add(act2).add(act3).add(act4);
      var found = lanes.find(Action);
      expect(found.length).to.be.equal(4);
      expect(found).to.be.instanceof(WrappedAction);

      found = lanes.find(ActLane2);
      expect(found.length).to.be.equal(2);
    });

  });

  describe('#findOne', function(){

    it('must allow to find one action across lanes', function(){
      var lanes = ActionLanes.create([ 'lane0', 'lane1', 'lane2' ]);

      var act1 = new ActLane1();
      var act2 = new ActLane1();
      var act3 = new ActLane2();
      var act4 = new ActLane2();

      lanes.add(act1).add(act2).add(act3).add(act4);

      var found = lanes.findOne(Action);
      expect(found.length).to.be.equal(1);
      expect(found.at(0)).to.be.equal(act1);

      found = lanes.findOne(ActLane2);
      expect(found.length).to.be.equal(1);
      expect(found.at(0)).to.be.equal(act3);

      found = lanes.findOne('YYY');
      expect(found.length).to.be.equal(0);
    });

  });

  describe('#update', function(){

    it('must call update on every ActionList (Lane)', function(){
      var lane1 = new ActionList();
      var lane2 = new ActionList();

      var lanes = new ActionLanes({ 'lane1': lane1, 'lane2': lane2 });

      sinon.spy(lane1, 'update');
      sinon.spy(lane2, 'update');

      var dt = 0.16;
      lanes.update(dt);

      expect(lane1.update).to.have.been.calledWith(dt);
      expect(lane2.update).to.have.been.calledWith(dt);
    });

  });

});
