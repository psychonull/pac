
var pac = require('../../../../src/pac');
var Drawable = require('../../../../src/Drawable');

var chai = require('chai');
var expect = chai.expect;

describe('Sprite', function(){

  it('must expose Sprite Class', function(){
    expect(pac.Sprite).to.be.a('function');
  });

  it('must be an Drawable', function(){
    expect(pac.Sprite.prototype).to.be.an.instanceof(Drawable);
  });

  require('./constructor.js');
  require('./methods.js');
  
});