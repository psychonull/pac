
var Cache = require('../../src/Cache');
var Base = require('../../src/Base');

var chai = require('chai');
var expect = chai.expect;

describe('Cache', function(){

  it('Must inherit from Base', function(){
    expect(Cache.prototype).to.be.an.instanceof(Base);
  });

});
