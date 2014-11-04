
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('AnimationList', function(){

  it('must expose AnimationList Class', function(){
    expect(pac.AnimationList).to.be.a('function');
  });

  it('must expose Animation Class', function(){
    expect(pac.Animation).to.be.a('function');
  });

  require('./Animation');
  require('./AnimationList');

});
