
var pac = require('../../../src/pac');
var EngineComponent = require('../../../src/EngineComponent');
var InputManager = require('../../../src/InputManager');

var chai = require('chai');
var expect = chai.expect;

var DummyInvalid = pac.Base.extend({});
var DummyRenderer = pac.Renderer.extend({});
var DummyLoader = pac.Loader.extend({});

describe('#use', function(){

  it('must exist', function() {
    var newGame = pac.create();
    expect(newGame.use).to.be.a('function');
  });

  it('must throw an error if the type is not valid', function() {
    var newGame = pac.create();

    expect(function(){
      newGame.use('dummy', pac.Base);
    }).to.throw('The type "dummy" is not allowed.');

  });

  it('must throw an error if a Component is not sent', function() {
    var newGame = pac.create();

    expect(function(){
      newGame.use('renderer');
    }).to.throw('Expected a "renderer" Component.');

  });

  describe('Renderer', function(){

    it('must attach a renderer', function() {
      var newGame = pac.create();
      expect(newGame.renderer).to.be.equal(null);

      newGame.use('renderer', DummyRenderer);
      expect(newGame.renderer).to.be.instanceof(DummyRenderer);
    });

    it('must throw an error if its not typeof Renderer', function() {
      var newGame = pac.create();

      expect(function(){
        newGame.use('renderer', DummyInvalid);
      }).to.throw('Type of "renderer" must inherit from pac.Renderer');

    });

    it('must allow to set options', function() {
      var newGame = pac.create();

      var newSize = { width: 1000, height: 500 };

      newGame.use('renderer', DummyRenderer, {
        size: newSize
      });

      expect(newGame.renderer.size).to.be.eql(newSize);
    });

    it('must allow to use NativeRenderer', function() {
      var ctn = document.createElement('div');
      ctn.id = 'native-render';

      var newGame = pac.create();
      newGame.use('renderer', pac.NativeRenderer, {
        container: ctn
      });

      var child = ctn.childNodes[0];

      expect(child).to.not.be.equal(undefined);

      var tag = child.tagName.toLowerCase();
      var parentId = child.parentNode.id;

      expect(tag).to.be.equal('canvas');
      expect(parentId).to.be.equal('native-render');
    });

    it('must allow to use PixiRenderer', function() {
      var ctn = document.createElement('div');
      ctn.id = 'pixi-render';

      var newGame = pac.create();
      newGame.use('renderer', pac.PixiRenderer, {
        container: ctn
      });

      var child = ctn.childNodes[0];

      expect(child).to.not.be.equal(undefined);

      var tag = child.tagName.toLowerCase();
      var parentId = child.parentNode.id;

      expect(tag).to.be.equal('canvas');
      expect(parentId).to.be.equal('pixi-render');
    });

  });

  describe('Loader', function(){

    it('must attach a loader', function() {
      var newGame = pac.create();
      expect(newGame.loader).to.be.equal(null);

      newGame.use('loader', DummyLoader);
      expect(newGame.loader).to.be.instanceof(DummyLoader);
    });

  });

  describe('InputManager', function(){

    it('must attach an InputManager', function() {
      var newGame = pac.create();
      expect(newGame.inputs).to.be.equal(null);

      newGame.use('renderer', pac.PixiRenderer);
      newGame.use('input', pac.MouseInput);

      expect(newGame.inputs).to.be.instanceof(InputManager);
    });

    it('must require a renderer viewport when an input is defined', function(){
      var newGame = pac.create();
      expect(newGame.inputs).to.be.equal(null);

      newGame.use('renderer', DummyRenderer);

      expect(function(){
        newGame.use('input', pac.MouseInput);
      }).to.throw('Renderer must define a [viewport] ' +
        'property to attach events');
    });

    it('must have the canvas as container for PIXI', function() {
      var pixiGame = pac.create();
      expect(pixiGame.inputs).to.be.equal(null);

      pixiGame.use('renderer', pac.PixiRenderer);
      pixiGame.use('input', pac.MouseInput);

      // check container
      var inputCtn = pixiGame.inputs.get('mouse').container;
      expect(inputCtn.tagName).to.be.equal('CANVAS');
    });

    it('must have the canvas as container for Native', function() {
      var nativeGame = pac.create();
      expect(nativeGame.inputs).to.be.equal(null);

      nativeGame.use('renderer', pac.NativeRenderer);
      nativeGame.use('input', pac.MouseInput);

      // check container
      var inputCtn = nativeGame.inputs.get('mouse').container;
      expect(inputCtn.tagName).to.be.equal('CANVAS');
    });

  });
});
