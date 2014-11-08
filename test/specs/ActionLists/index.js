
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Action Lists', function(){

  it('must expose ActionList Class', function(){
    expect(pac.ActionList).to.be.a('function');
  });

  it('must expose Action Class', function(){
    expect(pac.Action).to.be.a('function');
  });

  it('must expose pre-defined actions', function(){
    expect(pac.actions).to.be.an('object');
  });

  require('./Action');
  require('./ActionList');

  require('./Predefined');

});
