
var Animation = require('../../../../src/Animation');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Run Loop', function(){

  it('must allow to run as a loop', function(){

    var animation = new Animation({
      times: 0,
      frames: [ 5, 10, 20 ],
      fps: 60
    });

    var step = animation.step;

    var framefires = 0;

    var events = {
      start: 0,
      end: 0,
      play: 0,
      pause: 0,
      resume: 0,
      stop: 0,
      frame: 0
    };

    animation
      .on('start', function(){
        events.start++;
      })
      .on('end', function(){
        events.end++;
      })
      .on('play', function(){
        expect(animation.isPaused).to.be.false;
        expect(animation.isRunning).to.be.true;
        events.play++;
      })
      .on('pause', function(){
        expect(animation.isPaused).to.be.true;
        expect(animation.isRunning).to.be.false;
        events.pause++;
      })
      .on('resume', function(){
        expect(animation.isPaused).to.be.false;
        expect(animation.isRunning).to.be.true;
        events.resume++;
      })
      .on('stop', function(){
        expect(animation.isPaused).to.be.false;
        expect(animation.isRunning).to.be.false;
        events.stop++;
      })
      .on('frame', function(frame, index){

        expect(frame).to.be.a('number');
        expect(frame).to.be.greaterThan(4);

        expect(index).to.be.a('number');
        events.frame++;
      });

    expect(animation.isPaused).to.be.false;
    expect(animation.isRunning).to.be.false;

    animation.play();

    expect(animation.isPaused).to.be.false;
    expect(animation.isRunning).to.be.true;

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);

    ////////////////
    // Iteration 1

    animation.update(step);

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);

    ////////////////
    // Iteration 2

    animation.update(step);
    framefires++;

    expect(animation.frameIndex).to.be.equal(1);
    expect(animation.frame).to.be.equal(10);

    ////////////////
    // Iteration 3

    animation.update(step);
    framefires++;

    expect(animation.frameIndex).to.be.equal(2);
    expect(animation.frame).to.be.equal(20);

    animation.pause();

    expect(animation.isPaused).to.be.true;
    expect(animation.isRunning).to.be.false;

    ////////////////
    // Iteration 4

    animation.update(step);

    expect(animation.frameIndex).to.be.equal(2);
    expect(animation.frame).to.be.equal(20);

    animation.resume();

    expect(animation.isPaused).to.be.false;
    expect(animation.isRunning).to.be.true;

    ////////////////
    // Iteration 5

    animation.update(step);
    framefires++;

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);

    ////////////////
    // Iteration 7

    animation.update(step);
    framefires++;

    expect(animation.frameIndex).to.be.equal(1);
    expect(animation.frame).to.be.equal(10);

    animation.stop();
    expect(animation.isRunning).to.be.false;

    ////////////////
    // Iteration 7

    animation.update(step);

    expect(animation.frameIndex).to.be.equal(1);
    expect(animation.frame).to.be.equal(10);

    animation.play();

    expect(animation.isRunning).to.be.true;

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);

    ////////////////
    // Iteration 8

    animation.update(step);

    expect(animation.frameIndex).to.be.equal(0);
    expect(animation.frame).to.be.equal(5);

    ////////////////
    // Iteration 9

    animation.update(step);
    framefires++;

    expect(animation.frameIndex).to.be.equal(1);
    expect(animation.frame).to.be.equal(10);


    // If called stop and then play -> fires 'start' again
    expect(events.start).to.be.equal(2);
    // as this is a loop (times = 0) will never fire an end
    expect(events.end).to.be.equal(0);

    expect(events.play).to.be.equal(2);
    expect(events.pause).to.be.equal(1);
    expect(events.resume).to.be.equal(1);
    expect(events.stop).to.be.equal(1);
    expect(events.frame).to.be.equal(framefires);

  });

});

describe('Run Times', function(){

  it('must allow to run only one time', function(){

    var animation = new Animation({
      times: 1,
      frames: [ 5, 10, 20 ],
      fps: 60
    });

    var events = {
      start: 0,
      end: 0,
      frame: 0
    };

    animation
      .on('start', function(){
        events.start++;
      })
      .on('end', function(){
        events.end++;
      })
      .on('frame', function(){
        events.frame++;
      });

    var step = animation.step;

    animation.play();

    expect(events.end).to.be.equal(0);

    animation.update(step);
    expect(animation.frameIndex).to.be.equal(0);
    expect(events.end).to.be.equal(0);

    animation.update(step);
    expect(animation.frameIndex).to.be.equal(1);
    expect(events.end).to.be.equal(0);

    animation.update(step);
    expect(animation.frameIndex).to.be.equal(2);

    expect(events.start).to.be.equal(1);
    expect(events.end).to.be.equal(1);

    expect(events.frame).to.be.equal(2); // first is not trigger

  });

  it('must allow to run specific times', function(){

    var animation = new Animation({
      times: 3,
      frames: [ 5, 10, 20 ],
      fps: 60
    });

    var events = {
      start: 0,
      end: 0
    };

    animation
      .on('start', function(){
        events.start++;
      })
      .on('end', function(){
        events.end++;
      });

    var step = animation.step;

    animation.play();
    animation.update(step);

    for (var j=1; j<=3; j++){
      // Times

      expect(events.end).to.be.equal(0);

      for (var i=0; i<=2; i++){
        // Frames

        expect(animation.frameIndex).to.be.equal(i);
        animation.update(step);
      }
    }

    expect(events.start).to.be.equal(1);
    expect(events.end).to.be.equal(1);

  });

});
