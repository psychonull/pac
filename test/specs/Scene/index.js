
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');
var Emitter = require('../../../src/Emitter');

var expect = require('chai').expect;

describe('Scene', function(){

  it('must expose Scene Class', function(){
    expect(pac.Scene).to.be.a('function');
  });

  it('must be an Emitter', function(){
    expect(pac.Scene.prototype).to.be.an.instanceof(Emitter);
  });

  require('./constructor');
  require('./methods');

});
