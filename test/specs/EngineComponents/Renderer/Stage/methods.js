
var Stage = require('../../../../../src/Stage');
var Drawable = require('../../../../../src/Drawable');
var expect = require('chai').expect;

var TestObject = Drawable.extend();

describe('Methods', function(){
  
  describe('#add', function(){

    it ('must add an entity and fire an event', function(){

      var stage = new Stage();
      expect(stage.add).to.be.a('function');

      var objTest = new TestObject();

      var emitted = 0;
      stage.on('add', function(obj){
        emitted++;
        expect(obj.cid).to.be.equal(objTest.cid);
        console.log(obj.someProp);
      });

      stage.add(objTest);

      expect(stage.length).to.be.equal(1);
      expect(stage.get(objTest.cid).someProp).to.be.equal(objTest.someProp);
      expect(emitted).to.be.equal(1);
    });

  });

  describe('#clear', function(){

    it ('must clear all entities and fire an event', function(){

      var stage = new Stage();
      expect(stage.clear).to.be.a('function');

      var objTest = new TestObject();
      var objTest2 = new TestObject();

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
    });

  });

});