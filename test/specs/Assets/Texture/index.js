
var pac = require('../../../../src/pac');
var Asset = require('../../../../src/Asset');
var Texture = require('../../../../src/Texture');

var expect = require('chai').expect;

describe('Texture', function(){

  it('must expose Texture Class', function(){
    expect(pac.Texture).to.be.a('function');
  });

  it('must be an Asset', function(){
    expect(pac.Texture.prototype).to.be.an.instanceof(Asset);
  });

  require('./constructor');
  require('./methods');
  require('./statics');

});
