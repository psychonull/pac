
var Stage = require('../../../../../src/Stage');
var expect = require('chai').expect;

describe('Methods', function(){
  
  describe('#add', function(){

    it ('must add an entity and fire an event', function(){

      var stage = new Stage();
      expect(stage.add).to.be.a('function');

      var objTest = { cid: '1233', someProp: true };

      var emitted = 0;
      stage.on('add', function(cid, obj){
        emitted++;
        expect(cid).to.be.equal('1233');
        expect(obj.someProp).to.be.equal(true);
      });

      stage.add(objTest);

      expect(stage.length).to.be.equal(1);
      expect(stage.get('1233').someProp).to.be.equal(objTest.someProp);
      expect(emitted).to.be.equal(1);
    });

  });

  describe('#clear', function(){

    it ('must clear all entities and fire an event'/*, function(){

      var stage = new Stage();
      expect(stage.clear).to.be.a('function');

      var objTest = { cid: "1233", someProp: true };
      var objTest2 = { cid: "1233", someProp: true };

      stage.add(objTest);
      stage.add(objTest2);

      expect(stage.length).to.be.equal(2);

      var emitted = 0;
      stage.on('clear', function(){
        emitted++;
      });

      stage.clear();

      expect(stage.length).to.be.equal(0);
      expect(emitted).to.be.equal(1);
    }*/);

  });

});