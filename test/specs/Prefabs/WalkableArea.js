
var _ = require('../../../src/utils');
var Point = require('../../../src/Point');
var Rectangle = require('../../../src/Rectangle');
var GameObject = require('../../../src/GameObject');
var GameObjectList = require('../../../src/GameObjectList');

var Clickable = require('../../../src/actions/Clickable');
var Command = require('../../../src/actions/Command');
var WalkTo = require('../../../src/actions/WalkTo');

var WalkableArea = require('../../../src/prefabs/WalkableArea');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var fakeGame = {
  inputs: {
    cursor: {
      isDown: false,
      position: new Point()
    }
  }
};

var walkableOpts = {
  position: new Point(200, 200),

  shape: new Rectangle({
    position: new pac.Point(0,0),
    size: { width: 200, height: 100 }
  }),
};

var Walker = GameObject.extend();

var fakeWalker = new Walker({
  position: new Point(200, 200),
  actions: []
});

fakeWalker.game = fakeGame;

// props added by Walker Action
fakeWalker.velocity = 666;
fakeWalker.feet = new Point(30, 50);

var dt = 0.16;

describe('WalkableArea', function(){

  it('must throw an error if no Shape is defined', function(){

    expect(function(){
      var warea = new WalkableArea();
    }).to.throw('expected a shape');

  });

  it('must allow to create a WalkableArea with defaults', function(){

    var warea = new WalkableArea(_.clone(walkableOpts, true));

    expect(warea.name).to.be.equal('WalkableArea');

    expect(warea.position.x).to.be.equal(200);
    expect(warea.position.y).to.be.equal(200);

    expect(warea.walkers).to.be.instanceof(GameObjectList);
    expect(warea.walkers.length).to.be.equal(0);

    expect(warea.commands).to.be.null;
    expect(warea.actions.length).to.be.equal(1);
    expect(warea.actions.at(0)).to.be.instanceof(Clickable);

    expect(warea.onCommand).to.be.undefined;
  });

  it('must allow to create a WalkableArea listening to commands', function(){

    var opts = _.clone(walkableOpts, true);
    opts.commands = ['walkto', 'lookat'];

    var warea = new WalkableArea(opts);

    expect(warea.name).to.be.equal('WalkableArea');

    expect(warea.position.x).to.be.equal(200);
    expect(warea.position.y).to.be.equal(200);

    expect(warea.walkers).to.be.instanceof(GameObjectList);
    expect(warea.walkers.length).to.be.equal(0);

    expect(warea.commands).to.be.equal(opts.commands);
    expect(warea.actions.length).to.be.equal(1);
    expect(warea.actions.at(0)).to.be.instanceof(Command);

    expect(warea.onCommand).to.be.a('object');
    expect(warea.onCommand.walkto).to.be.a('function');
    expect(warea.onCommand.lookat).to.be.a('function');
  });

  describe('#addWalker', function(){

    it('must allow add a walker to be moved', function(){

      var opts = _.clone(walkableOpts, true);
      var warea = new WalkableArea(opts);

      expect(warea.addWalker).to.be.a('function');
      expect(warea.walkers.length).to.be.equal(0);

      warea.addWalker(fakeWalker);
      expect(warea.walkers.length).to.be.equal(1);
    });

  });

  describe('#removeWalker', function(){

    it('must allow remove a walker', function(){

      var opts = _.clone(walkableOpts, true);
      var warea = new WalkableArea(opts);

      expect(warea.removeWalker).to.be.a('function');
      expect(warea.walkers.length).to.be.equal(0);

      warea.addWalker(fakeWalker);
      expect(warea.walkers.length).to.be.equal(1);

      warea.removeWalker(fakeWalker);
      expect(warea.walkers.length).to.be.equal(0);
    });

  });

  describe('#clearWalkers', function(){

    it('must allow remove a walker', function(){

      var opts = _.clone(walkableOpts, true);
      var warea = new WalkableArea(opts);

      expect(warea.clearWalkers).to.be.a('function');
      expect(warea.walkers.length).to.be.equal(0);

      warea.addWalker(fakeWalker);
      expect(warea.walkers.length).to.be.equal(1);

      warea.clearWalkers();
      expect(warea.walkers.length).to.be.equal(0);
    });

  });

  describe('#moveWalkers', function(){

    it('must have the function', function(){
      var warea = new WalkableArea(_.clone(walkableOpts, true));
      expect(warea.moveWalkers).to.be.a('function');
    });

    it('must be called on any command if no commands were set', function(){

      sinon.spy(WalkableArea.prototype, 'moveWalkers');

      var warea = new WalkableArea(_.clone(walkableOpts, true));
      warea.game = _.clone(fakeGame);

      var pos = fakeGame.inputs.cursor.position = new Point(30, 40);

      warea.addWalker(fakeWalker);

      expect(fakeWalker.actions.length).to.be.equal(0);

      // Fired by Clickable Action
      warea.emit('click');

      expect(warea.moveWalkers).to.have.been.calledOnce;
      expect(warea.moveWalkers).to.have.been.calledWith(pos);

      // Created a WalkTo
      expect(fakeWalker.actions.length).to.be.equal(1);
      var act = fakeWalker.actions.at(0);
      expect(act).to.be.instanceof(WalkTo);

      expect(act.target.x).to.be.equal(pos.x);
      expect(act.target.y).to.be.equal(pos.y);
      expect(act.velocity).to.be.equal(fakeWalker.velocity);
      expect(act.pivot.x).to.be.equal(fakeWalker.feet.x);
      expect(act.pivot.y).to.be.equal(fakeWalker.feet.y);

      WalkableArea.prototype.moveWalkers.restore();
    });

    it('must be called on defined commands', function(){

      var spy = sinon.spy(WalkableArea.prototype, 'moveWalkers');

      var opts = _.clone(walkableOpts, true);
      opts.commands = ['walkto', 'lookat'];

      var warea = new WalkableArea(opts);
      warea.game = _.clone(fakeGame);

      var pos = fakeGame.inputs.cursor.position = new Point(30, 40);

      warea.addWalker(fakeWalker);

      // Fired by Command Action [walkto]
      warea.onCommand.walkto();

      expect(warea.moveWalkers).to.have.been.calledOnce;
      expect(warea.moveWalkers).to.have.been.calledWith(pos);

      // Created a WalkTo
      expect(fakeWalker.actions.length).to.be.equal(1);
      var act = fakeWalker.actions.at(0);
      expect(act).to.be.instanceof(WalkTo);

      expect(act.target.x).to.be.equal(pos.x);
      expect(act.target.y).to.be.equal(pos.y);
      expect(act.velocity).to.be.equal(fakeWalker.velocity);
      expect(act.pivot.x).to.be.equal(fakeWalker.feet.x);
      expect(act.pivot.y).to.be.equal(fakeWalker.feet.y);

      spy.reset();

      // Fired by Command Action [lookat]
      warea.onCommand.lookat();

      expect(warea.moveWalkers).to.have.been.calledOnce;
      expect(warea.moveWalkers).to.have.been.calledWith(pos);

      // Removed previous WalkTo and Created a NEW WalkTo
      expect(fakeWalker.actions.length).to.be.equal(1);
      act = fakeWalker.actions.at(0);
      expect(act).to.be.instanceof(WalkTo);

      expect(act.target.x).to.be.equal(pos.x);
      expect(act.target.y).to.be.equal(pos.y);
      expect(act.velocity).to.be.equal(fakeWalker.velocity);
      expect(act.pivot.x).to.be.equal(fakeWalker.feet.x);
      expect(act.pivot.y).to.be.equal(fakeWalker.feet.y);

      WalkableArea.prototype.moveWalkers.restore();
    });

  });

});