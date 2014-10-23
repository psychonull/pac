
var Stage = require('../../../../../src/Stage');
var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init an entities array', function(){
    var stage = new pac.Stage();
    expect(stage.entities).to.be.a('array');
    expect(stage.entities.length).to.be.equal(0);
  });

});