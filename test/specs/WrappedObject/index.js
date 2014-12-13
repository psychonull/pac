
var pac = require('../../../src/pac');
var WrappedObject = require('../../../src/WrappedObject');
var List = require('../../../src/List');

var expect = require('chai').expect;

describe('WrappedObject', function(){

  it('must expose WrappedObject Class', function(){
    expect(pac.WrappedObject).to.be.a('function');
  });

  it('must be an List', function(){
    expect(pac.WrappedObject.prototype).to.be.an.instanceof(List);
  });

  require('./constructor');
  require('./methods');

});
