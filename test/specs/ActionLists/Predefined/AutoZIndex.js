
var Point = require('../../../../src/Point');
var Rectangle = require('../../../../src/Rectangle');
var Sprite = require('../../../../src/Sprite');

var AutoZIndex = require('../../../../src/actions/AutoZIndex');

var chai = require('chai');
var expect = chai.expect;

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

var dt = 0.1;

describe('AutoZIndex', function(){

  describe('Create', function(){

    it('must allow to create by options', function(){
      var pos = new Point(20, 30);
      var act = new AutoZIndex({
        position: pos
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.baseZIndex).to.be.equal(0);
      expect(act.position).to.be.equal(pos);

      act = new AutoZIndex({
        position: pos,
        dynamic: true
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.true;
      expect(act.baseZIndex).to.be.equal(0);
      expect(act.position).to.be.equal(pos);

      act = new AutoZIndex({
        position: 'center',
        dynamic: false,
        baseZIndex: 10
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.baseZIndex).to.be.equal(10);
      expect(act.position).to.be.equal('center');

      act = new AutoZIndex();

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.baseZIndex).to.be.equal(0);
      expect(act.position).to.be.equal('feet');
    });

    it('must allow to create by parameters', function(){
      var pos = new Point(20, 30);
      var act = new AutoZIndex(false, pos);

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.position).to.be.equal(pos);

      act = new AutoZIndex(true);

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.true;
      expect(act.position).to.be.equal('feet');

      act = new AutoZIndex(true, 'head', 100);

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.true;
      expect(act.baseZIndex).to.be.equal(100);
      expect(act.position).to.be.equal('head');
    });

  });

  describe('onStart', function(){

    it ('must calculate the local position by FEET', function(){

      var act = new AutoZIndex(false, 'feet');
      var shape = new Rectangle({ size: { width: 50, height: 100 }});

      var obj = new TestObj({
        position: new Point(0, 10),
        shape: shape,
        zIndex: 500,
        actions: [ act ]
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.position).to.be.equal('feet');

      obj.updateActions(dt);

      var pos = shape.getBounds().getFeet();
      expect(act.position.x).to.be.equal(pos.x);
      expect(act.position.y).to.be.equal(pos.y);
    });

    it ('must calculate the local position by HEAD', function(){

      var act = new AutoZIndex(false, 'head');
      var shape = new Rectangle({ size: { width: 50, height: 100 }});

      var obj = new TestObj({
        position: new Point(0, 10),
        shape: shape,
        zIndex: 500,
        actions: [ act ]
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.position).to.be.equal('head');

      obj.updateActions(dt);

      var pos = shape.getBounds().getHead();
      expect(act.position.x).to.be.equal(pos.x);
      expect(act.position.y).to.be.equal(pos.y);
    });

    it ('must calculate the local position by CENTER', function(){

      var act = new AutoZIndex(false, 'center');
      var shape = new Rectangle({ size: { width: 50, height: 100 }});

      var obj = new TestObj({
        position: new Point(0, 10),
        shape: shape,
        zIndex: 500,
        actions: [ act ]
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.position).to.be.equal('center');

      obj.updateActions(dt);

      var pos = shape.getBounds().getCenter();
      expect(act.position.x).to.be.equal(pos.x);
      expect(act.position.y).to.be.equal(pos.y);
    });

    it ('must throw an error if has no Shape and position is a type',
      function(){

      var obj = new TestObj({
        position: new Point(0, 10),
        zIndex: 500,
        actions: [ new AutoZIndex() ]
      });

      expect(function(){
        obj.updateActions(dt);
      }).to.throw('Action AutoZIndex: Expected a [position] or a [shape]');


      obj = new TestObj({
        position: new Point(0, 10),
        zIndex: 500,
        actions: [ new AutoZIndex(false, new Point(0,1)) ]
      });

      expect(function(){
        obj.updateActions(dt);
      }).to.not.throw();

    });

  });

  describe('Running', function(){

     it('must calculate zIndex and set as finished if NOT dynamic', function(){
      var pos = new Point(10, 20);
      var act = new AutoZIndex(false, pos);

      var obj = new TestObj({
        position: new Point(0, 10),
        zIndex: 500,
        actions: [ act ]
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.false;
      expect(act.position).to.be.equal(pos);

      obj.updateActions(dt);

      var sum = obj.position.add(pos);
      expect(obj.zIndex).to.be.equal(sum.y);

      expect(act.isFinished).to.be.true;
    });

    it('must calculate zIndex plus a baseZIndex', function(){
      var pos = new Point(10, 20);
      var act = new AutoZIndex(false, pos, 100);

      var obj = new TestObj({
        position: new Point(0, 10),
        zIndex: 500,
        actions: [ act ]
      });

      obj.updateActions(dt);

      var sum = obj.position.add(pos);
      expect(obj.zIndex).to.be.equal(sum.y + 100);
    });

    it('must always calculate POSITIVE zIndex', function(){
      var pos = new Point(10, 20);
      var act = new AutoZIndex(false, pos, 100);

      var obj = new TestObj({
        position: new Point(0, -1000),
        actions: [ act ]
      });

      obj.updateActions(dt);

      var sum = obj.position.add(pos);
      expect(obj.zIndex).to.be.equal(0);
    });

    it('must calculate zIndex on every update', function(){
      var dt = 0.1;

      var pos = new Point(10, 20);
      var act = new AutoZIndex(true, pos);

      var obj = new TestObj({
        position: new Point(0, 10),
        zIndex: 500,
        actions: [ act ]
      });

      expect(act.isBlocking).to.be.false;
      expect(act.dynamic).to.be.true;
      expect(act.position).to.be.equal(pos);

      obj.updateActions(dt);

      var sum = obj.position.add(pos);
      expect(obj.zIndex).to.be.equal(sum.y);

      expect(act.isFinished).to.be.false;

      obj.position = new Point(50, 100);
      obj.updateActions(dt);

      sum = obj.position.add(pos);
      expect(obj.zIndex).to.be.equal(sum.y);

      expect(act.isFinished).to.be.false;

      // no change
      var lastZIndex = obj.zIndex;
      obj.updateActions(dt);

      expect(obj.zIndex).to.be.equal(lastZIndex);
      expect(act.isFinished).to.be.false;
    });

  });

});