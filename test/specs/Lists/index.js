
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Lists', function(){

  it('must expose List Class', function(){
    expect(pac.List).to.be.a('function');
  });

  it('must expose MapList Class', function(){
    expect(pac.MapList).to.be.a('function');
  });

  require('./list.js');
  require('./map.js');

});
