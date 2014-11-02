
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Action Lists', function(){

  it('must expose ActionList Class', function(){
    expect(pac.ActionList).to.be.a('function');
  });

  it('must expose Action Class', function(){
    expect(pac.Action).to.be.a('function');
  });

  require('./Action/index.js');
  require('./ActionList/index.js');

});
