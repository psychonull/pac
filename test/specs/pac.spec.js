var pac = require('../../src/pac');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('PAC', function(){

  describe('Game', function(){

    it('should exists Base Class', function(){
      expect(pac.Base).to.be.a('function');
    });

    it('example of sinon stub', function(done){
      var stub = sinon.stub();
      pac.runAfter(stub, 20);
      window.setTimeout(function(){
        expect(stub).to.have.been.called;
        done();
      }, 30);
    });

  });

});
