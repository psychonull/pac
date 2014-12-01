
var pac = require('../../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

describe('Renderer', function(){

  it('must expose Renderer Class', function(){
    expect(pac.Renderer).to.be.a('function');
  });

  it('must expose NativeRenderer Class', function(){
    expect(pac.NativeRenderer).to.be.a('function');
  });

  it('must expose PixiRenderer Class', function(){
    expect(pac.PixiRenderer).to.be.a('function');
  });

  require('./constructor');
  require('./methods');

});
