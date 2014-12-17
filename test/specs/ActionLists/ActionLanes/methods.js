
var ActionLanes = require('../../../../src/ActionLanes');
var ActionList = require('../../../../src/ActionList');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

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
