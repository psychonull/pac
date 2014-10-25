
var pac = require('../../../../src/pac');
var expect = require('chai').expect;

describe('Loader', function(){

  it('should expose Loader Class', function(){
    expect(pac.Loader).to.be.a('function');
  });

  require('./constructor');
  require('./methods');

});
