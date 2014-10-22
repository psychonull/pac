
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');

var expect = require('chai').expect;

describe('Scene', function(){

  it('must expose Scene Class', function(){
    expect(pac.Scene).to.be.a('function');
  });

  require('./constructor');
  
});