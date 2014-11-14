
var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

  describe('#play', function(){

    it('must allow to set and play current animation', function(){

      var idle = new Animation({ frames: [ 0, 1 ] });
      var run = new Animation({ frames: [ 2, 3, 6, 8, 7 ] });
      var jump = new Animation({ times: 1, frames: [ 4, 5 ] });

      var animations = {
        'idle': idle,
        'jump': jump,
      };

      var list = new AnimationList(animations, {
        default: 'idle'
      });

      list.add('run', run);

      expect(list.length).to.be.equal(3);

      expect(list.play).to.be.a('function');

      list.play();
      expect(idle.isRunning).to.be.true;

      list.play('run');
      expect(idle.isRunning).to.be.false;
      expect(run.isRunning).to.be.true;

      //Must auto play default after non loop animation ends

      list.play('jump');
      expect(idle.isRunning).to.be.false;
      expect(run.isRunning).to.be.false;
      expect(jump.isRunning).to.be.true;

      list.update(jump.step);
      list.update(jump.step);
      list.update(jump.step);

      expect(jump.isRunning).to.be.false;
      expect(idle.isRunning).to.be.true;

      // must not re run the animation if it's the curren

      list.play('run');
      list.update(run.step);
      list.update(run.step);

      var runFrame = run.frameIndex;

      list.play('run');
      list.update(run.step);
      expect(run.frameIndex).to.be.equal(runFrame+1);

    });

  });

  describe('#stop', function(){

    it('must allow to stop current animation if any', function(){

      var run = new Animation({ frames: [ 2, 3 ] });

      var animations = {
        'run': run
      };

      var list = new AnimationList(animations);

      expect(list.stop).to.be.a('function');

      list.play('run');
      expect(run.isRunning).to.be.true;

      list.stop();
      expect(run.isRunning).to.be.false;

    });

  });

  describe('#pause & #resume', function(){

    it('must allow to pause and resume current animation if any', function(){

      var run = new Animation({ frames: [ 2, 3 ] });

      var animations = {
        'run': run
      };

      var list = new AnimationList(animations);

      expect(list.pause).to.be.a('function');
      expect(list.resume).to.be.a('function');

      list.play('run');
      expect(run.isRunning).to.be.true;
      expect(run.isPaused).to.be.false;

      list.pause();
      expect(run.isRunning).to.be.false;
      expect(run.isPaused).to.be.true;

      list.resume();
      expect(run.isRunning).to.be.true;
      expect(run.isPaused).to.be.false;

    });

  });

  describe('#update', function(){

    it('must update current animation', function(){

      var idle = new Animation({ frames: [ 5, 10 ] });

      var animations = {
        'idle': idle
      };

      var list = new AnimationList(animations, {
        default: 'idle'
      });

      expect(list.update).to.be.a('function');

      list.play();
      expect(idle.frame).to.be.equal(5);

      list.update(idle.step);
      expect(idle.frame).to.be.equal(5);

      list.update(idle.step);
      expect(idle.frame).to.be.equal(10);

      list.update(idle.step);
      expect(idle.frame).to.be.equal(5);
    });

  });

});