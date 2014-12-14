
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

  describe('#insertAbove', function(){

    it('must insert an action into the list Above this action', function(){

      var thisAction = new Action();
      var list = new ActionList([ new Action(), thisAction, new Action() ]);
      var lenBefore = list.length;

      expect(thisAction.insertAbove).to.be.a('function');

      var toInsert = new Action();
      thisAction.insertAbove(toInsert);

      expect(list.length).to.be.equal(lenBefore+1);
      expect(list.at(1).cid).to.be.equal(toInsert.cid);
      expect(list.at(2).cid).to.be.equal(thisAction.cid);
    });

  });

  describe('#insertBelow', function(){

    it('must insert an action into the list Below this action', function(){

      var thisAction = new Action();
      var list = new ActionList([ new Action(), thisAction, new Action() ]);
      var lenBefore = list.length;

      expect(thisAction.insertBelow).to.be.a('function');

      var toInsert = new Action();
      thisAction.insertBelow(toInsert);

      expect(list.length).to.be.equal(lenBefore+1);
      expect(list.at(1).cid).to.be.equal(thisAction.cid);
      expect(list.at(2).cid).to.be.equal(toInsert.cid);
    });

    it('must add an action into the list Below last action', function(){

      var thisAction = new Action();
      var list = new ActionList([ new Action(), new Action(), thisAction ]);
      var lenBefore = list.length;

      expect(thisAction.insertBelow).to.be.a('function');

      var toInsert = new Action();
      thisAction.insertBelow(toInsert);

      expect(list.length).to.be.equal(lenBefore+1);
      expect(list.at(2).cid).to.be.equal(thisAction.cid);
      expect(list.at(3).cid).to.be.equal(toInsert.cid);
    });

  });

  describe('Movement', function(){

    describe('#moveUp', function(){

      it('must move itself to current index -1', function(){
        var act = new Action();
        expect(act.moveUp).to.be.a('function');

        var list = new ActionList([ new Action(), act, new Action() ]);
        sinon.spy(list, 'move');

        act.moveUp();

        expect(list.move).to.have.been.calledWith(act, 0);
      });

    });

    describe('#moveDown', function(){

      it('must move itself to current index +1', function(){
        var act = new Action();
        expect(act.moveDown).to.be.a('function');

        var list = new ActionList([ new Action(), act, new Action() ]);
        sinon.spy(list, 'move');

        act.moveDown();

        expect(list.move).to.have.been.calledWith(act, 2);
      });

    });

    describe('#moveTop', function(){

      it('must move itself current index to 0', function(){
        var act = new Action();
        expect(act.moveTop).to.be.a('function');

        var list = new ActionList([ new Action(), new Action(), act ]);
        sinon.spy(list, 'move');

        act.moveTop();

        expect(list.move).to.have.been.calledWith(act, 0);
      });

    });

    describe('#moveBottom', function(){

      it('must move itself current index to list.length', function(){
        var act = new Action();
        expect(act.moveBottom).to.be.a('function');

        var list = new ActionList(
          [new Action(), act ,new Action(),new Action()]);
        sinon.spy(list, 'move');

        act.moveBottom();

        expect(list.move).to.have.been.calledWith(act, 3);
      });

    });

    describe('#moveTo', function(){

      it('must move itself current index to a given index', function(){
        var act = new Action();
        expect(act.moveTo).to.be.a('function');

        var list = new ActionList(
          [new Action(),new Action(), act ,new Action()]);
        sinon.spy(list, 'move');

        act.moveTo(1);

        expect(list.move).to.have.been.calledWith(act, 1);
      });

    });

    it('must not throw errors', function(){
      var act = new Action();
      expect(act.moveTo).to.be.a('function');

      var list = new ActionList(
        [new Action(),new Action(), act ,new Action()]);

      expect(function(){

        act.moveTo(-2);
        act.moveTo(0);
        act.moveTo(50);

        (new Action()).moveTo(1);

        (new Action()).moveTop();
        (new Action()).moveBottom();
        (new Action()).moveUp();
        (new Action()).moveDown();

      }).to.not.throw();
    });

  });

  describe('#resolve', function(){

    it('must resolve required Actions', function(){
      var dt = 0.16;

      var CustomActionA = Action.extend({
        update: function(){}
      });

      var CustomActionB = Action.extend({
        requires: [],
        update: function(){}
      });

      var CustomActionC = Action.extend({
        requires: [ CustomActionA, CustomActionB ],
        update: function(){}
      });

      var CustomActionD = Action.extend({
        requires: [ CustomActionC ],
        update: function(){}
      });

      var CustomActionD2 = Action.extend({
        requires: [ CustomActionC ],
        update: function(){}
      });

      // NULL requires /////////////////////////////////////
      var actA = new CustomActionA();
      var list = new ActionList([ actA ]);

      expect(list.length).to.be.equal(1);
      list.update(dt);
      expect(actA.started).to.be.true;
      expect(list.length).to.be.equal(1);

      // Blank requires /////////////////////////////////////
      var actB = new CustomActionB();
      list = new ActionList([ actB ]);

      expect(list.length).to.be.equal(1);
      list.update(dt);
      expect(actB.started).to.be.true;
      expect(list.length).to.be.equal(1);

      // First Level Dependencies /////////////////////////////////////
      var actC = new CustomActionC();
      list = new ActionList([ actC ]);

      expect(list.length).to.be.equal(1);
      list.update(dt);
      expect(actC.started).to.be.false;
      expect(list.length).to.be.equal(3);

      list.update(dt);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(1)).to.be.instanceof(CustomActionB);
      expect(list.at(0).started).to.be.true;
      expect(list.at(1).started).to.be.true;
      expect(actC.started).to.be.true;

      // Second Level Dependencies /////////////////////////////////////
      var actD = new CustomActionD();
      list = new ActionList([ actD ]);

      expect(list.length).to.be.equal(1);
      expect(actD.started).to.be.false;

      list.update(dt);

      // added ActionC
      expect(list.length).to.be.equal(2);
      expect(list.at(0)).to.be.instanceof(CustomActionC);
      expect(list.at(0).started).to.be.false;
      expect(actD.started).to.be.false;

      list.update(dt);

      // added ActionA and B
      expect(list.length).to.be.equal(4);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(1)).to.be.instanceof(CustomActionB);
      expect(list.at(2)).to.be.instanceof(CustomActionC);
      expect(list.at(0).started).to.be.false;
      expect(list.at(1).started).to.be.false;
      expect(list.at(2).started).to.be.false;
      expect(actD.started).to.be.false;

      list.update(dt);

      expect(list.length).to.be.equal(4);
      expect(list.at(0).started).to.be.true;
      expect(list.at(1).started).to.be.true;
      expect(list.at(2).started).to.be.true;
      expect(actD.started).to.be.true;

      // Second Level Dependencies Mixed /////////////////////////////////////
      var actD2 = new CustomActionD2();
      list = new ActionList([ new CustomActionA(), actD2 ]);

      expect(list.length).to.be.equal(2);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(0).started).to.be.false;
      expect(actD2.started).to.be.false;

      list.update(dt);
      expect(list.length).to.be.equal(3);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(1)).to.be.instanceof(CustomActionC);
      expect(list.at(0).started).to.be.true;
      expect(list.at(1).started).to.be.false;
      expect(actD2.started).to.be.false;

      list.update(dt);
      expect(list.length).to.be.equal(4);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(1)).to.be.instanceof(CustomActionB);
      expect(list.at(2)).to.be.instanceof(CustomActionC);
      expect(list.at(0).started).to.be.true;
      expect(list.at(1).started).to.be.false;
      expect(list.at(2).started).to.be.false;
      expect(actD2.started).to.be.false;

      list.update(dt);
      expect(list.length).to.be.equal(4);
      expect(list.at(0)).to.be.instanceof(CustomActionA);
      expect(list.at(1)).to.be.instanceof(CustomActionB);
      expect(list.at(2)).to.be.instanceof(CustomActionC);
      expect(list.at(0).started).to.be.true;
      expect(list.at(1).started).to.be.true;
      expect(list.at(2).started).to.be.true;
      expect(actD2.started).to.be.true;

    });

  });

});