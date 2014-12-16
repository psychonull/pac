

var WrappedObject = require('../../../../src/WrappedObject');
var WrappedAction = require('../../../../src/WrappedAction');

var expect = require('chai').expect;

describe('WrappedAction', function(){

  it('must be inherit from WrappedObject', function(){
    expect(WrappedAction.prototype).to.be.an.instanceof(WrappedObject);
  });

  require('./methods');

});
