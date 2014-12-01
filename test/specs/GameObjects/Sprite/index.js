
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');

var chai = require('chai');
var expect = chai.expect;

describe('Sprite', function(){

  it('must expose Sprite Class', function(){
    expect(pac.Sprite).to.be.a('function');
  });

  it('must be an GameObject', function(){
    expect(pac.Sprite.prototype).to.be.an.instanceof(GameObject);
  });

  require('./constructor.js');
  require('./methods.js');

});