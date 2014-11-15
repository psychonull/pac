
var pac = require('../../../../src/pac');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var WalkTo = require('../../../../src/actions/WalkTo');

var chai = require('chai');
var expect = chai.expect;

var TestObj = pac.Sprite.extend({
  texture: 'testTexture'
});

describe('WalkTo', function(){

  it('must initialize with options', function(){

    var walkto = new WalkTo({
      target: new Point(20, 20)
    });

    expect(walkto.isBlocking).to.be.true;

    expect(walkto.target.x).to.be.equal(20);
    expect(walkto.target.y).to.be.equal(20);

    expect(walkto.velocity).to.be.equal(10);
    expect(walkto.pivot.x).to.be.equal(0);
    expect(walkto.pivot.y).to.be.equal(0);

    expect(walkto.nearness).to.be.equal(1);

    walkto = new WalkTo({
      target: new Point(150, 200),
      velocity: 100,
      pivot: new Point(25, 50),
      nearness: 5
    });

    expect(walkto.isBlocking).to.be.true;

    expect(walkto.target.x).to.be.equal(150);
    expect(walkto.target.y).to.be.equal(200);

    expect(walkto.velocity).to.be.equal(100);
    expect(walkto.pivot.x).to.be.equal(25);
    expect(walkto.pivot.y).to.be.equal(50);
    expect(walkto.nearness).to.be.equal(5);
  });

  it('must throw an error if target is not defined', function(){

    expect(function(){
      var walkto = new WalkTo();
    }).to.throw('expected a [target] to Walk To');
  });

  it('must start, update moving and finish an object movement', function(){

    var vel = 100;
    var pivot = new Point(50, 200); // at feet
    var position = new Point(200, 300);
    var target = new Point(300, 400);

    var movePos = position.add(pivot);
    var moveLen = target.subtract(movePos).length();
    var dir = target.subtract(movePos).normalize();

    var walkto = new WalkTo({
      target: target,
      velocity: vel,
      pivot: pivot
    });

    var obj = new TestObj({
      position: position,
      actions: [ walkto ],
    });

    var walkStart = 0;
    var walkStop = 0;

    obj.on('walk:start', function(){
      walkStart++;
      expect(this.walkingTo.x).to.be.equal(walkto.dir.x);
      expect(this.walkingTo.y).to.be.equal(walkto.dir.y);
    });

    obj.on('walk:stop', function(){
      walkStop++;
      expect(obj.walkingTo).to.be.null;
    });

    walkto.onStart();

    // OnStart initialization
    expect(walkto.offset.x).to.be.equal(movePos.x);
    expect(walkto.offset.y).to.be.equal(movePos.y);

    expect(walkto.dir.x).to.be.equal(dir.x);
    expect(walkto.dir.y).to.be.equal(dir.y);

    expect(obj.walkingTo.x).to.be.equal(walkto.dir.x);
    expect(obj.walkingTo.y).to.be.equal(walkto.dir.y);

    // updates for move to finish
    var dt = 0.16;
    var steps = parseInt(moveLen/(dt*vel), 10) + 1;
    for (var i=0; i<steps; i++){

      walkto.update(dt);

      var move = new pac.Point(vel * dt * dir.x, vel * dt * dir.y);
      movePos = movePos.add(move);
      position = movePos.subtract(pivot);

      expect(obj.position.x).to.be.equal(parseInt(position.x, 10));
      expect(obj.position.y).to.be.equal(parseInt(position.y, 10));
    }

    expect(walkto.isFinished).to.be.true;

    var lenToTarget = position.add(pivot).subtract(target).length();
    expect(lenToTarget).to.be.lessThan(walkto.nearness);

    // onEnd call
    walkto.onEnd();

    expect(obj.walkingTo).to.be.null;

    expect(walkStart).to.be.equal(1);
    expect(walkStop).to.be.equal(1);

  });

});