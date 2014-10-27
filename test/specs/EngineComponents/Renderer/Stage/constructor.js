
var Stage = require('../../../../../src/Stage');
var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init a cache object', function(){
    var stage = new pac.Stage();
    expect(stage).to.be.an('object');
    expect(stage.length).to.be.equal(0);
  });

});