
var Sprite = require('../../../../src/Sprite');

var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){
  
  describe('#update', function(){

    it('must expose update method', function(){
      var obj = new pac.Sprite({
        texture: 'test'
      });

      expect(obj.update).to.be.a('function');
    });

  });

  describe('Animations', function(){

    it('must expose an updateAnimations method', function(){

      var idle = new Animation({ frames: [ 0, 1 ] });
      var run = new Animation({ frames: [ 2, 3 ] });

      var list = new AnimationList({
        'idle': idle,
        'run': run
      }, { default: 'idle', autostart: true });

      var sprite = new Sprite({
        texture: 'test',
        animations: list
      });

      expect(sprite.updateAnimations).to.be.a('function');

      sinon.spy(list, 'update');

      var dt = 0.16;
      sprite.updateAnimations(dt);

      expect(list.update).to.have.been.calledWith(dt);

      list.update.restore();
    });

    it('must not use updateAnimations method if has none', function(){

      expect(function(){
        var obj = new Sprite({
          texture: 'test'
        });

        obj.updateAnimations(0.16);

      }).to.not.throw();

    });

  });

});
