
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');
var WrappedAction = require('../../../../src/WrappedAction');
var _ = require('../../../../src/utils');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

  it('must run methods in its childs', function(){

    var methods = [
      'insertAbove',
      'insertBelow',
      'block',
      'unblock',
      'blockOnce',
      'moveUp',
      'moveDown',
      'moveTop',
      'moveBottom',
      'remove',
      'moveTo',
    ];

    var act1 = new Action();
    var act2 = new Action();

    _.forEach(methods, function(method){
      sinon.spy(act1, method);
      sinon.spy(act2, method);
    });

    var list = new ActionList([ act1, act2 ]);
    var wrap = new WrappedAction(list);

    _.forEach(methods, function(method){

      expect(wrap[method]).to.be.a('function');

      act1[method].reset();
      act2[method].reset();

      var result = wrap[method](1, 2);

      expect(result).to.be.equal(wrap);

      expect(act1[method]).to.have.been.calledOnce;
      expect(act2[method]).to.have.been.calledOnce;

      expect(act1[method]).to.have.been.calledWith(1, 2);
      expect(act2[method]).to.have.been.calledWith(1, 2);
    });

    var first = wrap.at(0);
    expect(wrap.index()).to.be.equal(first.index());
  });

});