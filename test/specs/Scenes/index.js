
var pac = require('../../../src/pac');
var Scenes = require('../../../src/Scenes');

var expect = require('chai').expect;

describe('Scenes', function(){

  it('must NOT expose Scenes Class', function(){
    expect(pac.Scenes).to.be.equal(undefined);
  });

  it('must have default Values', function(){
    var scenes = new Scenes();

    expect(scenes.current).to.be.equal(null);

    expect(scenes._scenes).to.be.an('array');
    expect(scenes._scenes.length).to.be.equal(0);
  });

  require('./methods');

});
