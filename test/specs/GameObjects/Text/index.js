
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');

var chai = require('chai');
var expect = chai.expect;

describe('Text', function(){

  it('must expose Text Class', function(){
    expect(pac.Text).to.be.a('function');
  });

  it('must be an GameObject', function(){
    expect(pac.Text.prototype).to.be.an.instanceof(GameObject);
  });

  require('./constructor.js');
  require('./methods.js');

});
