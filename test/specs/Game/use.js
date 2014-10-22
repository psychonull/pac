
var pac = require('../../../src/pac');
var EngineComponent = require('../../../src/EngineComponent');

var chai = require('chai');
var expect = chai.expect;

var DummyInvalid = pac.Base.extend({});
var DummyRenderer = pac.Renderer.extend({});
var DummyLoader = EngineComponent.extend({});

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

  });

});