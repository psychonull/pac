
var Sprite = require('../../../../src/Sprite');

var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var Rectangle = require('../../../../src/Rectangle');

var expect = require('chai').expect;

describe('Constructor', function(){

  it ('must create an Sprite with defaults', function(){
    var sprite = new Sprite({
      texture: 'test'
    });

    expect(sprite.name).to.be.equal('Sprite');
    expect(sprite.position.x).to.be.equal(0);
    expect(sprite.position.y).to.be.equal(0);

    expect(sprite.size).to.be.equal(null);
    expect(sprite.frame).to.be.equal(null);
  });

  it ('must create an Sprite', function(){
    var sprite = new Sprite({
      texture: 'test',
      position: new pac.Point(100, 100),
      size: {
        width: 50,
        height: 50
      },
      frame: 1
    });

    expect(sprite.position.x).to.be.equal(100);
    expect(sprite.position.y).to.be.equal(100);

    expect(sprite.size.width).to.be.equal(50);
    expect(sprite.size.height).to.be.equal(50);
    expect(sprite.frame).to.be.equal(1);
  });

  it ('must allow to create Prefabs from Sprite', function(){

    var MySprite = Sprite.extend({
      texture: 'test',
      position: { x: 100, y: 100 },
      size: {
        width: 50,
        height: 50
      },
      frame: 'idle_1'
    });

    var test = new MySprite();

    expect(test.texture).to.be.equal('test');

    expect(test.position.x).to.be.equal(100);
    expect(test.position.y).to.be.equal(100);

    expect(test.size.width).to.be.equal(50);
    expect(test.size.height).to.be.equal(50);
    expect(test.frame).to.be.equal('idle_1');

    var initCalled = false;

    var MySprite2 = MySprite.extend({
      size: {
        width: 200,
        height: 100
      },
      init: function(options){
        expect(options.myOpt).to.be.true;
        expect(this.position.x).to.be.equal(100);
        initCalled = true;
      }
    });

    test = new MySprite2({
      myOpt: true
    });

    expect(test.size.width).to.be.equal(200);
    expect(test.texture).to.be.equal('test');
    expect(initCalled).to.be.true;

  });

  it ('must allow to create an Sprite with a shape', function(){
    var sprite = new Sprite({
      texture: 'test',
      shape: new Rectangle(),
    });

    expect(sprite.shape.position.x).to.be.equal(0);
    expect(sprite.shape.size.width).to.be.equal(50);
  });

  it ('must allow to create an Sprite with a default shape', function(){
    var sprite = new Sprite({
      texture: 'test',
      shape: true,
      size: {
        width: 200,
        height: 200
      }
    });

    expect(sprite.shape).to.be.an.instanceof(Rectangle);

    expect(sprite.shape.position.x).to.be.equal(0);
    expect(sprite.shape.position.y).to.be.equal(0);

    expect(sprite.shape.size.width).to.be.equal(200);
    expect(sprite.shape.size.height).to.be.equal(200);
  });

  it ('must throw an error if no size and auto-hitbox requested', function(){

    expect(function(){
      var sprite = new Sprite({
        texture: 'test',
        shape: true
      });
    }).to.throw('Cannot create a shape for this Sprite without a size');

  });

  it ('must try to use the size of the texture if no size is specified');

  it ('must throw an error if no texture is specify', function(){

    expect(function(){
      var sprite = new Sprite();
    }).to.throw('Expected [texture] name of Sprite');

  });

  describe('Animations', function(){

    it('must allow to set and initialize Animations', function(){

      var list = new AnimationList({
        'idle': new Animation({ frames: [ 0, 1 ] }),
        'run': new Animation({ frames: [ 2, 3 ] })
      }, { default: 'idle' });

      var sprite = new Sprite({
        texture: 'test',
        position: new pac.Point(100, 100),
        size: {
          width: 50,
          height: 50
        },
        animations: list
      });

      expect(sprite.animations).to.be.an.instanceof(AnimationList);
      expect(sprite.animations.length).to.be.equal(2);
      expect(sprite.animations.owner).to.be.equal(sprite);
    });

  });

});