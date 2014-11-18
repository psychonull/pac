
var pac = require('../../../src/pac');
var Scenes = require('../../../src/Scenes');

var chai = require('chai');
var expect = chai.expect;

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