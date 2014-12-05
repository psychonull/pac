
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Stage', function(){

  it('should expose an Stage Class', function(){
    expect(pac.Stage).to.be.a('function');
  });

  require('./constructor');
  require('./methods');

  require('./Layer');

});
