
var Animation = require('../../../../src/Animation');

var chai = require('chai');
var expect = chai.expect;

describe('Constructor', function(){

  it('must allow to create an animation with defaults', function(){
    var animation = new Animation();
    
    expect(animation.times).to.be.equal(0);

    expect(animation.frames).to.be.an('array');
    expect(animation.frames.length).to.be.equal(0);
    expect(animation.fps).to.be.equal(60);
    expect(animation.step).to.be.equal(1/60);

    expect(animation.isPaused).to.be.false;
    expect(animation.isRunning).to.be.false;

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(undefined);
  });

  it('must allow to create an animation with options', function(){

    var animation = new Animation({
      times: 0,
      frames: [ 5, 10, 20, 30 ],
      fps: 45
    });
    
    expect(animation.times).to.be.equal(0);
    
    expect(animation.frames).to.be.an('array');
    expect(animation.frames.length).to.be.equal(4);
    expect(animation.fps).to.be.equal(45);
    expect(animation.step).to.be.equal(1/45);

    expect(animation.isPaused).to.be.false;
    expect(animation.isRunning).to.be.false;

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);
  });

});