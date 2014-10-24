
var pac = require('../../../src/pac');
var Emitter = require('../../../src/Emitter');
var Texture = require('../../../src/Texture');

var expect = require('chai').expect;

describe('Texture', function(){

  it('must expose Texture Class', function(){
    expect(pac.Texture).to.be.a('function');
  });

  it('must be an Emitter', function(){
    expect(pac.Texture.prototype).to.be.an.instanceof(Emitter);
  });

  require('./constructor');
  require('./methods');
  require('./statics');

});
