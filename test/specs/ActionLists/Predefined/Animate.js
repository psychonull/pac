
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var Animate = require('../../../../src/actions/Animate');

var chai = require('chai');
var expect = chai.expect;

var idle = new Animation({ frames: [ 0, 1 ] });
var run = new Animation({ frames: [ 2, 3, 6, 8, 7 ] });
var jump = new Animation({ times: 1, frames: [ 4, 5 ], fps: 60 });

var animations = {
  'idle': idle,
  'run': run,
  'jump': jump
};

var TestObj = Sprite.extend({
  texture: 'testTexture',
  animations: new AnimationList(animations, { default: 'idle' })
});

describe('Animate', function(){

  describe('Create', function(){

    it('must throw an error if has no animations defined', function(){
      expect(function(){

        var obj = new Sprite({
          texture: 'testTexture',
          actions: [ new Animate('run') ]
        });

        obj.updateActions();

      }).to.throw('Animate Action requires [animations] on the Object');
    });

    it('must throw an error if the animation is not found', function(){
      expect(function(){

        var obj = new TestObj({
          actions: [ new Animate('crouch') ]
        });

        obj.updateActions();

      }).to.throw('Animate Action animation [crouch] not found');
    });

    it('must throw an error if an animation is not specify', function(){
      expect(function(){
        var anim = new Animate();
      }).to.throw('Animate Action expected an animation name');
    });

    it('must be non blocking by default', function(){
      var anim = new Animate('run');
      expect(anim.isBlocking).to.be.false;
    });

    it('must allow to set as blocking', function(){
      var anim = new Animate('run', true);
      expect(anim.isBlocking).to.be.true;
      expect(anim.animationName).to.be.equal('run');
    });

    it('must allow to set as NON blocking', function(){
      var anim = new Animate('run', false);
      expect(anim.isBlocking).to.be.false;
      expect(anim.animationName).to.be.equal('run');
    });

    it('must allow to set as options object', function(){
      var anim = new Animate({
        animationName: 'run',
        blocking: false
      });

      expect(anim.isBlocking).to.be.false;
      expect(anim.animationName).to.be.equal('run');
    });

  });

  describe('Running', function(){

    it('must an animation onStart and finish it-self', function(){
      var dt = 0.1;

      var obj = new TestObj({
        actions: [ new Animate('run') ]
      });

      var runAnimation = obj.animations.get('run');

      expect(runAnimation.started).to.be.false;

      obj.updateActions(dt);
      obj.updateAnimations(dt);

      expect(runAnimation.started).to.be.true;
      expect(obj.actions.length).to.be.equal(0);
    });

    it('must an animation onStart and finish it-self when animation ends',
      function(){

      var obj = new TestObj({
        actions: [ new Animate('jump', true) ]
      });

      var dt = 1;
      var jump = obj.animations.get('jump');

      expect(jump.started).to.be.false;

      obj.updateActions(dt);
      obj.updateAnimations(dt);

      expect(jump.started).to.be.true;
      expect(jump.isRunning).to.be.true;

      expect(obj.actions.length).to.be.equal(1);

      for (var i=0; i<2; i++){
        obj.updateActions(dt);
        obj.updateAnimations(dt);
      }

      expect(jump.isRunning).to.be.false;
      expect(obj.actions.length).to.be.equal(0);

    });

  });

});