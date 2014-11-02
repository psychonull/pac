

var Emitter = require('../../../../src/Emitter');
var Action = require('../../../../src/Action');

var expect = require('chai').expect;

describe('Action', function(){

  it('must be inherit from Emitter', function(){
    expect(Action.prototype).to.be.an.instanceof(Emitter);
  });

  require('./constructor');
  require('./methods');
  
});
