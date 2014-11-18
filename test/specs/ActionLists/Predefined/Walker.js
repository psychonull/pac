
var pac = require('../../../../src/pac');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Scene = require('../../../../src/Scene');

var WalkableArea = require('../../../../src/prefabs/WalkableArea');
var Walker = require('../../../../src/actions/Walker');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestObj = pac.Sprite.extend({
  texture: 'testTexture'
});

var warea = new WalkableArea({
  position: new Point(200, 200),

  shape: new Rectangle({
    position: new pac.Point(0,0),
    size: { width: 200, height: 100 }
  }),
});

var fakeGame = {
  inputs: {
    cursor: {
      isDown: false,
      position: new Point()
    }
  },

  findOne: function(){
    return warea;
  }
};

var scene = new Scene({
  name: 'Scene01',
  size: { width: 500, height: 600 }
});

scene.game = fakeGame;

var dt = 0.16;

describe('Walker', function(){

  beforeEach(function(){
    // clear objects
    warea.walkers.clear();
    scene.objects.clear();
  });

  it('must initialize with options', function(){

    var walker = new Walker();

    expect(walker.velocity).to.be.equal(10);
    expect(walker.feet).to.be.null;
    expect(walker.area).to.be.equal('WalkableArea');

    walker = new Walker({
      area: 'MyArea',
      velocity: 100,
      feet: new Point(25, 50)
    });

    expect(walker.area).to.be.equal('MyArea');
    expect(walker.velocity).to.be.equal(100);
    expect(walker.feet.x).to.be.equal(25);
    expect(walker.feet.y).to.be.equal(50);

  });

  it ('must auto-find feet by SIZE on start', function(){

    var walker = new Walker();

    var obj = new TestObj({
      size: { width: 100, height: 200 },
      actions: [ walker ],
    });

    scene.addObject(warea);
    scene.addObject(obj);
    scene._update(dt);

    expect(walker.feet.x).to.be.equal(50);
    expect(walker.feet.y).to.be.equal(200);
  });

  it ('must auto-find feet by SHAPE on start', function(){

    var walker = new Walker();

    var obj = new TestObj({
      size: { width: 100, height: 200 },
      shape: new Rectangle({ size: { width: 300, height: 300 } }),
      actions: [ walker ],
    });

    scene.addObject(warea);
    scene.addObject(obj);
    scene._update(dt);

    expect(walker.feet.x).to.be.equal(150);
    expect(walker.feet.y).to.be.equal(300);
  });

  it ('must set feet to 0,0 if it couldnt auto-find', function(){

    var walker = new Walker();

    var obj = new TestObj({
      actions: [ walker ],
    });

    scene.addObject(warea);
    scene.addObject(obj);
    scene._update(dt);

    expect(walker.feet.x).to.be.equal(0);
    expect(walker.feet.y).to.be.equal(0);
  });

  it('must throw an error if a walkable area is not found', function(){

    var noWAreaScene = new Scene({
      name: 'Scene01',
      size: { width: 500, height: 600 }
    });

    noWAreaScene.game = { findOne: function(){ return undefined; }};

    var obj = new TestObj({
      actions: [ new Walker() ],
    });

    noWAreaScene.addObject(obj);

    expect(function(){
      noWAreaScene._update(dt);
    }).to.throw('A WalkableArea with name [WalkableArea] was not found.');

  });

  it('must add it-self into WalkableArea on start', function(){

    sinon.spy(warea, 'addWalker');

    var walkerAction = new Walker({
      velocity: 100,
      feet: new Point(25, 50)
    });

    var obj = new TestObj({
      actions: [ walkerAction ],
    });

    scene.addObject(warea);
    scene.addObject(obj);
    scene._update(dt);

    expect(obj.actions.length).to.be.equal(1);

    expect(walkerAction.walkableArea).to.be.equal(warea);
    expect(obj.feet).to.be.equal(walkerAction.feet);
    expect(obj.velocity).to.be.equal(walkerAction.velocity);

    expect(warea.addWalker).to.have.been.calledOnce;
    expect(warea.addWalker).to.have.been.calledWith(obj);
    expect(walkerAction.walkableArea.walkers.length).to.be.equal(1);

    warea.addWalker.restore();
  });

  it('must remove it-self from WalkableArea on end', function(){

    sinon.spy(warea, 'removeWalker');

    var walkerAction = new Walker({
      velocity: 100,
      feet: new Point(25, 50)
    });

    var obj = new TestObj({
      actions: [ walkerAction ],
    });

    scene.addObject(warea);
    scene.addObject(obj);

    scene._update(dt);

    expect(obj.actions.length).to.be.equal(1);
    expect(walkerAction.walkableArea.walkers.length).to.be.equal(1);

    walkerAction.isFinished = true;

    scene._update(dt);

    expect(warea.removeWalker).to.have.been.calledOnce;
    expect(warea.removeWalker).to.have.been.calledWith(obj);
    expect(walkerAction.walkableArea.walkers.length).to.be.equal(0);

    warea.removeWalker.restore();
  });

});