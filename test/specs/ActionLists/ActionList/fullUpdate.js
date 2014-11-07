
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');
var Drawable = require('../../../../src/Drawable');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Monkey = Drawable.extend();

var WalkRight = Action.extend({

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) {
    this.actions.owner.position.x -= dt;
  }

});

var Delay = Action.extend({

  init: function(options){
    this.isBlocking = true;

    this.times = options.times;
    this.count = 0;
  },

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) {
    this.count++;
    if (this.count === this.times){
      this.isFinished = true;
    }
  }

});

var WalkLeft = Action.extend({
  onStart: function() {
    this.count = 0;
  },

  onEnd: function() {
    this.insertInFrontOfMe(new Delay({ times: 2 }));
    this.insertInFrontOfMe(new WalkRight());
  },

  update: function(dt) {
    this.actions.owner.position.x += dt;
    this.count++;

    if (this.count === 2){
      this.isFinished = true;
    }
  }
});

describe('fullUpdate', function(){

  it('must go through the list and update all actions', function(){
    var dt = 0.16;

    var monkey = new Monkey();
    expect(monkey.position.x).to.be.equal(0);

    sinon.spy(WalkLeft.prototype, 'onStart');
    sinon.spy(WalkLeft.prototype, 'onEnd');
    sinon.spy(WalkLeft.prototype, 'update');

    sinon.spy(WalkRight.prototype, 'onStart');
    sinon.spy(WalkRight.prototype, 'onEnd');
    sinon.spy(WalkRight.prototype, 'update');

    sinon.spy(Delay.prototype, 'onStart');
    sinon.spy(Delay.prototype, 'onEnd');
    sinon.spy(Delay.prototype, 'update');

    var list = new ActionList();
    list.owner = monkey;

    var walkLeft = new WalkLeft();
    list.add(walkLeft);

    expect(walkLeft.onStart).to.not.have.been.called;

    ///////////////////////////////////////////
    // Iteration 1

    list.update(dt);

    expect(walkLeft.onStart).to.have.been.called;
    expect(walkLeft.update).to.have.been.calledWith(dt);
    expect(walkLeft.isFinished).to.be.equal(false);

    expect(monkey.position.x).to.be.equal(dt);

    walkLeft.onStart.reset();
    walkLeft.update.reset();

    ///////////////////////////////////////////
    // Iteration 2

    list.update(dt);

    expect(walkLeft.onStart).to.not.have.been.called;
    expect(walkLeft.update).to.have.been.calledWith(dt);

    expect(monkey.position.x).to.be.equal(dt*2);
    expect(walkLeft.isFinished).to.be.equal(true);

    expect(walkLeft.onEnd).to.have.been.calledOnce;

    expect(list.length).to.be.equal(2);

    var lastMonkeyX = monkey.position.x;

    walkLeft.update.reset();

    ///////////////////////////////////////////
    // Iteration 3

    var delay = list.at(0);
    var walkRight = list.at(1);

    list.update(dt);

    expect(walkLeft.update).to.not.have.been.called;
    expect(monkey.position.x).to.be.equal(lastMonkeyX);

    expect(delay.onStart).to.have.been.called;
    expect(delay.update).to.have.been.calledWith(dt);

    // delay is blocking, should not call walk right
    expect(walkRight.update).to.not.have.been.called;

    delay.onStart.reset();
    delay.update.reset();
    walkRight.update.reset();

    ///////////////////////////////////////////
    // Iteration 4

    list.update(dt);

    expect(walkLeft.update).to.not.have.been.called;
    expect(monkey.position.x).to.be.equal(lastMonkeyX);

    expect(delay.onStart).to.not.have.been.called;
    expect(delay.update).to.have.been.calledWith(dt);

    // delay is blocking, should not call walk right
    expect(walkRight.update).to.not.have.been.called;

    expect(delay.onEnd).to.have.been.calledOnce;

    expect(list.length).to.be.equal(1);

    delay.update.reset();
    walkRight.update.reset();

    ///////////////////////////////////////////
    // Iteration 5

    list.update(dt);

    expect(walkLeft.update).to.not.have.been.called;
    expect(delay.update).to.not.have.been.called;

    expect(walkRight.update).to.have.been.calledWith(dt);
    expect(monkey.position.x).to.be.lessThan(lastMonkeyX);

    walkRight.update.reset();

    // Clean Spies

    walkLeft.onStart.restore();
    walkLeft.onEnd.restore();
    walkLeft.update.restore();

    walkRight.onStart.restore();
    walkRight.onEnd.restore();
    walkRight.update.restore();

    delay.onStart.restore();
    delay.onEnd.restore();
    delay.update.restore();

  });

});