
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = pac.Renderer.extend({

  onLayerFill: function(){ },
  onLayerClear: function(){ },
  render: function(){}

});

var MockScene = pac.Scene.extend({

  init: function(){ },
  onEnter: function(){ },
  onExit: function(){ },
  update: function(){}

});

var game;

describe('GameLoop', function(){

  before(function(){

    game = pac.create();
    game.use('renderer', MockRenderer);

    game.use('scenes', {
      'test': new MockScene({
        size: { width: 100, height: 100 }
      })
    });

  });

  it('must be able to start', function(done) {
    expect(game.start).to.be.a('function');

    var emitted = 0;
    game.on('start', function(){
      emitted++;
    });

    game.start('test');
    expect(emitted).to.be.equal(1);

    expect(game.dt).to.be.greaterThan(0);
    expect(game.time).to.be.greaterThan(0);

    var currentTime = game.time;

    setTimeout(function(){
      expect(game.time).to.be.greaterThan(currentTime);
      done();
    }, 50);
  });

  it('must be able to pause', function(done) {
    expect(game.pause).to.be.a('function');

    var emitted = 0;
    game.on('pause', function(){
      emitted++;
    });

    expect(game.paused).to.be.equal(false);
    game.pause();
    expect(game.paused).to.be.equal(true);
    expect(emitted).to.be.equal(1);

    var currentTime = game.time;

    setTimeout(function(){
      expect(game.time).to.be.equal(currentTime);
      expect(emitted).to.be.equal(1);
      done();
    }, 50);
  });

  it('must be able to resume', function(done) {
    expect(game.resume).to.be.a('function');

    var emitted = 0;
    game.on('resume', function(){
      emitted++;
    });

    var currentTime = game.time;

    expect(game.paused).to.be.equal(true);
    game.resume();
    expect(game.paused).to.be.equal(false);

    expect(emitted).to.be.equal(1);

    setTimeout(function(){
      expect(game.time).to.be.greaterThan(currentTime);
      expect(emitted).to.be.equal(1);
      done();
    }, 50);
  });

  it('must be able to end', function(done) {
    expect(game.end).to.be.a('function');

    var emitted = 0;
    game.on('end', function(){
      emitted++;
    });

    var currentTime = game.time;

    game.end();
    expect(emitted).to.be.equal(1);

    setTimeout(function(){
      expect(game.time).to.be.equal(currentTime);
      expect(emitted).to.be.equal(1);
      done();
    }, 50);
  });

  it('must call update and draw in that order', function(done) {
    var testGame = pac.create({
      fps: 15
    });

    sinon.spy(MockRenderer.prototype, 'render');

    testGame.use('renderer', MockRenderer);

    testGame.use('scenes', {
      'test': new MockScene({
        size: { width: 100, height: 100 }
      })
    });

    var updateTime = 0;
    var drawTime = 0;

    testGame.on('update', function(dt){
      expect(dt).to.be.greaterThan(0);
      updateTime = new Date().getTime();
    });

    testGame.on('draw', function(){
      drawTime = new Date().getTime();
    });

    testGame.start('test');

    var currentTime = testGame.time;

    setTimeout(function(){
      expect(testGame.time).to.be.greaterThan(currentTime);

      expect(drawTime).to.be.greaterThan(0);
      expect(updateTime).to.be.greaterThan(0);

      expect(drawTime).to.be.greaterThan(updateTime);

      testGame.end();

      expect(testGame.renderer.render).to.have.been.called;

      MockRenderer.prototype.render.restore();
      done();

    }, 50);

  });

});