
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

});