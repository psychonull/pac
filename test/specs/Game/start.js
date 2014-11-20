
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');
var Renderer = require('../../../src/Renderer');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = Renderer.extend({

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

describe('#start', function(){

  it('must exist', function() {
    var newGame = pac.create();
    expect(newGame.start).to.be.a('function');
  });

  it('must throw an error if no scene is sent', function() {
    var newGame = pac.create();

    expect(function(){
      newGame.start();
    }).to.throw('expected an scene to start with game.start(\'scene-name\');');

  });

  it('must throw an error if scenes were not setup', function() {
    var newGame = pac.create();

    expect(function(){
      newGame.start('scene-test');
    }).to.throw('must define scenes. game.use(\'scenes\', scenes);');

  });

  it('must call loadScene to first scene on start', function() {
    var game = pac.create();

    game.use('renderer', MockRenderer);

    game.use('scenes', {
      'test': new MockScene({
        size: { width: 100, height: 100 }
      }),
      'startScene': new MockScene({
        size: { width: 100, height: 100 }
      })
    });

    expect(game.loadScene).to.be.a('function');

    sinon.spy(game, 'loadScene');

    game.start('startScene');

    expect(game.loadScene).to.have.been.calledWith('startScene');

    game.loadScene.restore();
  });

});