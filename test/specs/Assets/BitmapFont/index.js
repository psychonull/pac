
var pac = require('../../../../src/pac');
var Asset = require('../../../../src/Asset');
var BitmapFont = require('../../../../src/BitmapFont');

var expect = require('chai').expect;

describe('BitmapFont', function(){

  it('must expose BitmapFont Class', function(){
    expect(pac.BitmapFont).to.be.a('function');
  });

  it('must be an Asset', function(){
    expect(pac.BitmapFont.prototype).to.be.an.instanceof(Asset);
  });

  require('./constructor');
  require('./methods');

});
