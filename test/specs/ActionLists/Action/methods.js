
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

  describe('#onStart', function(){

    it('must have an onStart', function(){
      var action = new Action();
      expect(action.onStart).to.be.a('function');
    });

  });

  describe('#onEnd', function(){

    it('must have an onEnd', function(){
      var action = new Action();
      expect(action.onEnd).to.be.a('function');
    });

  });

  describe('#update', function(){

    it('must have an update method and be a must override', function(){
      var action = new Action();
      expect(action.update).to.be.a('function');

      expect(function(){
        action.update();
      }).to.throw('Must override action.update()');

    });

  });

  describe('#insertInFrontOfMe', function(){

    it('must call the actionList insertBefore with this action', function(){

      var thisAction = new Action();
      var list = new ActionList([ new Action(), thisAction, new Action() ]);
      var lenBefore = list.length;

      expect(thisAction.insertInFrontOfMe).to.be.a('function');

      var toInsert = new Action();
      thisAction.insertInFrontOfMe(toInsert);

      expect(list.length).to.be.equal(lenBefore+1);
      expect(list.at(1).cid).to.be.equal(toInsert.cid);
      expect(list.at(2).cid).to.be.equal(thisAction.cid);
    });

  });

  describe('#insertBehindMe', function(){

    it('must call the actionList insertAfter with this action', function(){

      var thisAction = new Action();
      var list = new ActionList([ new Action(), thisAction, new Action() ]);
      var lenBefore = list.length;

      expect(thisAction.insertBehindMe).to.be.a('function');

      var toInsert = new Action();
      thisAction.insertBehindMe(toInsert);

      expect(list.length).to.be.equal(lenBefore+1);
      expect(list.at(1).cid).to.be.equal(thisAction.cid);
      expect(list.at(2).cid).to.be.equal(toInsert.cid);
    });

  });

});