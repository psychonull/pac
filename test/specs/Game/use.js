
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var DummyRenderer = pac.Base.extend({});
var DummyLoader = pac.Base.extend({});

describe('#use', function(){

  it('must exist', function() {
    var newGame = pac.create();
    expect(newGame.use).to.be.a('function');
  });

  it('must throw an error if the type is not valid', function() {
    var newGame = pac.create();

    expect(function(){
      newGame.use('dummy', pac.Base);
    }).to.throw('Component type "dummy" not valid');

  });

  it('must attach a renderer', function() {
    var newGame = pac.create();
    expect(newGame.renderer).to.be.equal(null);

    newGame.use('renderer', DummyRenderer);
    expect(newGame.renderer).to.be.instanceof(DummyRenderer);
  });

  it('must attach a loader', function() {
    var newGame = pac.create();
    expect(newGame.loader).to.be.equal(null);

    newGame.use('loader', DummyLoader);
    expect(newGame.loader).to.be.instanceof(DummyLoader);
  });

});