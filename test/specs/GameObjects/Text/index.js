
var pac = require('../../../../src/pac');
var Drawable = require('../../../../src/Drawable');

var chai = require('chai');
var expect = chai.expect;

describe('Text', function(){

  it('must expose Text Class', function(){
    expect(pac.Text).to.be.a('function');
  });

  it('must be an Drawable', function(){
    expect(pac.Text.prototype).to.be.an.instanceof(Drawable);
  });

  require('./constructor.js');
  require('./methods.js');

});
