
var pac = require('../../../../src/pac');
var Asset = require('../../../../src/Asset');
var JsonFile = require('../../../../src/JsonFile');

var expect = require('chai').expect;

describe('JsonFile', function(){

  it('must expose JsonFile Class', function(){
    expect(pac.JsonFile).to.be.a('function');
  });

  it('must be an Asset', function(){
    expect(pac.JsonFile.prototype).to.be.an.instanceof(Asset);
  });

  require('./constructor');
  require('./methods');
  //require('./statics');

});
