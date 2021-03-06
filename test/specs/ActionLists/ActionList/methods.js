
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestAction1 = Action.extend({
  update: function() {}
});

var TestAction2 = Action.extend({
  update: function() {}
});

var TestAction3 = Action.extend({
  update: function() {}
});

describe('Methods', function(){

  describe('#pushFront', function(){

    it('must insert an Action at the begining', function(){
      var list = new ActionList([ new TestAction1(), new TestAction2() ]);

      expect(list.pushFront).to.be.a('function');

      var len = list.length;

      var act = new TestAction3();
      list.pushFront(act);

      expect(list.length).to.be.equal(len+1);
      expect(list.at(0).cid).to.be.equal(act.cid);

      expect(act.actions).to.be.equal(list);
    });

  });

  describe('#pushBack', function(){

    it('must add an Action at the end', function(){
      var list = new ActionList([ new TestAction1(), new TestAction2() ]);

      expect(list.pushBack).to.be.a('function');

      var len = list.length;

      var act = new TestAction3();
      list.pushBack(act);

      expect(list.length).to.be.equal(len+1);
      expect(list.at(list.length-1).cid).to.be.equal(act.cid);

      expect(act.actions).to.be.equal(list);
    });

  });

  describe('#add', function(){

    it('must add an Action at the end (same as pushBack)', function(){

      var list = new ActionList([ new TestAction1(), new TestAction2() ]);

      expect(list.add).to.be.a('function');

      var len = list.length;

      var act = new TestAction3();
      list.add(act);

      expect(list.length).to.be.equal(len+1);
      expect(list.at(list.length-1).cid).to.be.equal(act.cid);

      expect(act.actions).to.be.equal(list);
    });

  });

  describe('#insertBefore', function(){

    it('must insert an Action before another Action', function(){
      var beforeAct = new TestAction2();
      var list = new ActionList([ new TestAction1(), beforeAct ]);

      expect(list.insertBefore).to.be.a('function');

      var len = list.length;

      var act = new TestAction3();
      list.insertBefore(act, beforeAct);

      expect(list.length).to.be.equal(len+1);
      expect(list.at(1).cid).to.be.equal(act.cid);
      expect(list.at(2).cid).to.be.equal(beforeAct.cid);

      expect(act.actions).to.be.equal(list);
    });

  });

  describe('#insertAfter', function(){

    it('must insert an Action after another Action', function(){
      var afterAct = new TestAction2();
      var list = new ActionList([ afterAct, new TestAction1() ]);

      expect(list.insertAfter).to.be.a('function');

      var len = list.length;

      var act = new TestAction3();
      list.insertAfter(act, afterAct);

      expect(list.length).to.be.equal(len+1);
      expect(list.at(0).cid).to.be.equal(afterAct.cid);
      expect(list.at(1).cid).to.be.equal(act.cid);

      expect(act.actions).to.be.equal(list);
    });

  });

  describe('#update', function(){

    it('must have an update method', function(){
      var list = new ActionList();
      expect(list.update).to.be.a('function');
    });

  });

  describe('#has', function(){

    it('must return if an Action exists in the list', function(){

      var list = new ActionList([ new TestAction1(), new TestAction2() ]);

      expect(list.has).to.be.a('function');

      expect(list.has(TestAction1)).to.be.true;
      expect(list.has(TestAction2)).to.be.true;
      expect(list.has(TestAction3)).to.be.false;
    });

  });

  describe('#removeAll', function(){

    it('must remove all Actions of a Type from the list', function(){

      var RemoveType = Action.extend({
        init: function(name){
          this.isBlocking = true;
          this.name = name;
        },
        onStart: function() {},
        onEnd: function() {},
        update: function() {}
      });


      var removeA = new RemoveType('A');
      var removeB = new RemoveType('B');
      var removeC = new RemoveType('C');

      sinon.spy(removeA, 'onStart');
      sinon.spy(removeB, 'onStart');
      sinon.spy(removeC, 'onStart');

      sinon.spy(removeA, 'onEnd');
      sinon.spy(removeB, 'onEnd');
      sinon.spy(removeC, 'onEnd');

      var list = new ActionList([
        removeA,
        new TestAction2(),
        removeB,
        removeC,
        new TestAction3()
      ]);

      expect(list.removeAll).to.be.a('function');
      expect(list.length).to.be.equal(5);

      list.update();

      expect(removeA.started).to.be.true;
      expect(removeB.started).to.be.false;
      expect(removeC.started).to.be.false;

      // Only called first one since is blocking
      expect(removeA.onStart).to.have.been.calledOnce;
      expect(removeB.onStart).to.not.have.been.called;
      expect(removeC.onStart).to.not.have.been.called;

      expect(list.has(RemoveType)).to.be.true;
      expect(list.has(TestAction2)).to.be.true;
      expect(list.has(TestAction3)).to.be.true;

      list.removeAll(RemoveType);
      expect(list.length).to.be.equal(2);

      // Only called first one since is the only one started
      expect(removeA.onEnd).to.have.been.calledOnce;
      expect(removeB.onEnd).to.not.have.been.called;
      expect(removeC.onEnd).to.not.have.been.called;

      expect(list.has(RemoveType)).to.be.false;
      expect(list.has(TestAction2)).to.be.true;
      expect(list.has(TestAction3)).to.be.true;
    });

  });

});