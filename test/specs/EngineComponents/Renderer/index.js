
var pac = require('../../../../src/pac');
var expect = require('chai').expect;

describe('Renderer', function(){

  it('should expose Renderer Class', function(){
    expect(pac.Renderer).to.be.a('function');
  });

});
