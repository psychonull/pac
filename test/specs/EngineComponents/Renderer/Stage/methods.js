
var Stage = require('../../../../../src/Stage');
var Drawable = require('../../../../../src/Drawable');
var Layer = require('../../../../../src/Layer');
var GameObjectList = require('../../../../../src/GameObjectList');
var GameObject = require('../../../../../src/GameObject');

var expect = require('chai').expect;

var TestObject = Drawable.extend();

var stage;

describe('Methods', function(){

  before(function(){
    stage = new Stage({
      'testLayer1': new Layer(),
      'testLayer2': new Layer(),
    });

    // also default layer gets added
    expect(stage.length).to.be.equal(3);
  });
  
  describe('#addObjects', function(){

    it ('must add an array of objects and fire events', function(){

      expect(stage.add).to.be.a('function');

      var objTest = new TestObject();
      var objTestLayered = new TestObject({ layer: 'testLayer1' });

      var emitted = 0;
      stage.on('addToLayer', function(obj, layer){
        emitted++;
        
        if (!obj.layer) {
          expect(layer).to.be.equal('default');
        }
        else {
          expect(layer).to.be.equal(obj.layer);
        }
      });

      stage.addObjects([ objTest, objTestLayered ]);

      var layer0 = stage.get('default');
      var layer1 = stage.get('testLayer1');
      var layer2 = stage.get('testLayer2');

      expect(layer0.length).to.be.equal(1);
      expect(layer0.at(0).cid).to.be.equal(objTest.cid);

      expect(layer1.length).to.be.equal(1);
      expect(layer1.at(0).cid).to.be.equal(objTestLayered.cid);

      expect(layer2.length).to.be.equal(0);
      
      expect(emitted).to.be.equal(2);

      layer0.clear();
      layer1.clear();
      layer2.clear();
    });

    it ('must add an instance of List and only add Drawable ones', function(){

      expect(stage.add).to.be.a('function');

      var list = new GameObjectList();

      var objTest = new TestObject();
      var testGM = new GameObject();

      var objTestLayered = new TestObject({ layer: 'testLayer1' });

      list.add([ objTest, testGM, objTestLayered ]);

      var emitted = 0;
      stage.on('addToLayer', function(obj, layer){
        emitted++;
      });

      stage.addObjects(list);

      var layer0 = stage.get('default');
      var layer1 = stage.get('testLayer1');
      var layer2 = stage.get('testLayer2');

      expect(layer0.length).to.be.equal(1);
      expect(layer0.at(0).cid).to.be.equal(objTest.cid);

      expect(layer1.length).to.be.equal(1);
      expect(layer1.at(0).cid).to.be.equal(objTestLayered.cid);

      expect(layer2.length).to.be.equal(0);
      
      expect(emitted).to.be.equal(2);

      layer0.clear();
      layer1.clear();
      layer2.clear();
    });

  });

  describe('#clearLayer', function(){

    it ('must clear all layer objects and fire an event', function(){
     
      expect(stage.clearLayer).to.be.a('function');
 
      var emitted = 0;
      stage.on('layerClear', function(layer){
        emitted++;
        
        expect(layer).to.be.an('string');
        expect(layer.length).to.be.greaterThan(0);
      });

      stage.addObjects([ 

        // default layer (3)
        new TestObject(), 
        new TestObject(), 
        new TestObject(), 

        // testLayer1 (4)
        new TestObject({ layer: 'testLayer1' }),
        new TestObject({ layer: 'testLayer1' }),
        new TestObject({ layer: 'testLayer1' }),
        new TestObject({ layer: 'testLayer1' }),

        // testLayer2 (5)
        new TestObject({ layer: 'testLayer2' }),
        new TestObject({ layer: 'testLayer2' }),
        new TestObject({ layer: 'testLayer2' }),
        new TestObject({ layer: 'testLayer2' }),
        new TestObject({ layer: 'testLayer2' })

      ]);

      var layer0 = stage.get('default');
      var layer1 = stage.get('testLayer1');
      var layer2 = stage.get('testLayer2');

      expect(layer0.length).to.be.equal(3);
      expect(layer1.length).to.be.equal(4);
      expect(layer2.length).to.be.equal(5);

      stage.clearLayer('default'); //specify a layer to clear

      expect(layer0.length).to.be.equal(0);
      expect(layer1.length).to.be.equal(4);
      expect(layer2.length).to.be.equal(5);
      expect(emitted).to.be.equal(1);

      emitted = 0;

      stage.clearLayer(); //clear all layers
      
      expect(layer1.length).to.be.equal(0);
      expect(layer2.length).to.be.equal(0);
      expect(emitted).to.be.equal(2);

    });

  });

});