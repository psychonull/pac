
var Stage = require('../../../../../src/Stage');
var expect = require('chai').expect;

describe('Methods', function(){
  
  describe('#add', function(){

    it ('must add an entity and fire an event', function(){

      var stage = new Stage();
      expect(stage.add).to.be.a('function');

      var objTest = { someProp: true };

      var emitted = 0;
      stage.on('add', function(obj){
        emitted++;
        expect(obj).to.be.eql(objTest);
      });

      stage.add(objTest);

      expect(stage.entities.length).to.be.equal(1);
      expect(stage.entities[0]).to.be.equal(objTest);
      expect(emitted).to.be.equal(1);
    });

  });

  describe('#clear', function(){

    it ('must clear all entities and fire an event', function(){

      var stage = new Stage();
      expect(stage.clear).to.be.a('function');

      var objTest = { someProp: true };
      var objTest2 = { someProp: true };

      stage.add(objTest);
      stage.add(objTest2);

      expect(stage.entities.length).to.be.equal(2);

      var emitted = 0;
      stage.on('clear', function(){
        emitted++;
      });

      stage.clear();

      expect(stage.entities.length).to.be.equal(0);
      expect(emitted).to.be.equal(1);
    });

  });

});