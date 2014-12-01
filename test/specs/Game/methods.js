
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');
var Renderer = require('../../../src/Renderer');

var GameObjectList = require('../../../src/GameObjectList');
var GameObject = require('../../../src/GameObject');
var GameObject = require('../../../src/GameObject');

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

describe('#create', function(){

  it('must exist', function() {
    expect(pac.create).to.be.a('function');
  });

  it('must return a default new Game if no args provided', function() {
    var newGame = pac.create();

    expect(newGame).to.be.an.instanceof(pac.Game);
    expect(newGame.scenes).to.be.null;

  });

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

  it('must have a getScene method and return the current', function() {
    var game = pac.create();

    expect(game.getScene).to.be.a('function');

    game.use('renderer', MockRenderer);

    var scenes = {
      'scene1': new MockScene(),
      'scene2': new MockScene(),
    };

    game.use('scenes', scenes);

    game.start('scene1');

    expect(game.scenes.current).to.be.equal(scenes.scene1);
    expect(game.getScene()).to.be.equal(scenes.scene1);

    game.end();
  });

});

describe('Objects', function(){

  it('must have methods to manage objects at game level', function() {
    var game = pac.create();

    expect(game.objects).to.be.instanceof(GameObjectList);
    expect(game.objects.length).to.be.equal(0);

    expect(game.addObject).to.be.a('function');
    expect(game.findOne).to.be.a('function');
    expect(game.find).to.be.a('function');
  });

  describe('#addObject', function(){

    it('must allow to add objects at game level', function() {
      var game = pac.create();

      expect(game.objects.length).to.be.equal(0);
      game.addObject(new GameObject());
      expect(game.objects.length).to.be.equal(1);

      game.addObject([ new GameObject(), new GameObject() ]);
      expect(game.objects.length).to.be.equal(3);
    });

  });

  describe('#find & findOne', function(){

    it('must find objects on game and the current scene', function(done) {
      var game = pac.create();

      game.use('renderer', MockRenderer);

      var scenes = {
        'scene1': new MockScene(),
        'scene2': new MockScene(),
      };

      game.use('scenes', scenes);

      game.start('scene1');

      expect(game.objects.length).to.be.equal(0);
      expect(scenes.scene1.objects.length).to.be.equal(0);
      expect(scenes.scene2.objects.length).to.be.equal(0);

      game.addObject([
        new GameObject({ name: 'obj1', layer: 'game' }),
        new GameObject({ name: 'obj2', layer: 'game' })
      ]);

      scenes.scene1.addObject([
        new GameObject({ name: 'obj1', layer: 'scene1' }),
        new GameObject({ name: 'obj2', layer: 'scene1' }),
        new GameObject({ name: 'obj3', layer: 'scene1' })
      ]);

      scenes.scene2.addObject([
        new GameObject({ name: 'obj2', layer: 'scene2' }),
        new GameObject({ name: 'obj4', layer: 'scene2' })
      ]);

      expect(game.objects.length).to.be.equal(2);
      expect(scenes.scene1.objects.length).to.be.equal(3);
      expect(scenes.scene2.objects.length).to.be.equal(2);

      expect(game.scenes.current).to.be.equal(scenes.scene1);

      // find one
      var found = game.findOne('obj1');
      expect(found.layer).to.be.equal('game');

      found = game.findOne('obj3');
      expect(found.layer).to.be.equal('scene1');

      found = game.findOne('obj4');
      expect(found).to.be.undefined;

      // find multiple
      var founds = game.find('obj1');
      expect(founds.length).to.be.equal(2);

      founds = game.find('obj3');
      expect(founds.length).to.be.equal(1);

      founds = game.find('obj2');
      expect(founds.length).to.be.equal(2);


      // change scene
      game.loadScene('scene2');

      setTimeout(function(){

        // find one
        found = game.findOne('obj1');
        expect(found.layer).to.be.equal('game');

        found = game.findOne('obj3');
        expect(found).to.be.undefined;

        found = game.findOne('obj4');
        expect(found.layer).to.be.equal('scene2');

        // find multiple
        founds = game.find('obj1');
        expect(founds.length).to.be.equal(1);

        founds = game.find('obj4');
        expect(founds.length).to.be.equal(1);

        founds = game.find('obj2');
        expect(founds.length).to.be.equal(2);

        game.end();
        done();
      }, 100);
    });

  });

});