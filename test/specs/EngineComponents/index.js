
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Engine Components', function(){

  it('should NOT expose EngineComponent Class', function(){
    expect(pac.EngineComponent).to.be.equal(undefined);
  });

  require('./Renderer');
  require('./Loader');

});
