
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Game', function(){

  it('example of sinon stub', function(done){
    var stub = sinon.stub();
    pac.runAfter(stub, 20);
    window.setTimeout(function(){
      expect(stub).to.have.been.called;
      done();
    }, 30);
  });

  it('should expose Game Class', function(){
    expect(pac.Game).to.be.a('function');
  });

  require('./create.js');
  require('./use.js');

});