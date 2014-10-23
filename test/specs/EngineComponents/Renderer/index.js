
var pac = require('../../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

describe('Renderer', function(){

  require('./Stage/index');

  it('must expose Renderer Class', function(){
    expect(pac.Renderer).to.be.a('function');
  });

  require('./constructor');
  require('./methods');

});
