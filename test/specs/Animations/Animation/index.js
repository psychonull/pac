

var Emitter = require('../../../../src/Emitter');
var Animation = require('../../../../src/Animation');

var expect = require('chai').expect;

describe('Animation', function(){

  it('must be inherit from Emitter', function(){
    expect(Animation.prototype).to.be.an.instanceof(Emitter);
  });

  require('./constructor');
  require('./methods');
  
});
