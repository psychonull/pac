
var Stage = require('../../../src/Stage');
var GameObject = require('../../../src/GameObject');
var Layer = require('../../../src/Layer');
var GameObjectList = require('../../../src/GameObjectList');

var expect = require('chai').expect;

var TestObject = GameObject.extend();

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

    it ('must add an array of objects', function(){

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

      expect(emitted).to.be.equal(0);

      stage.ready();
      var objTest2 = new TestObject();
      stage.addObjects(objTest2);
      expect(emitted).to.be.equal(1);

      layer0.clear();
      layer1.clear();
      layer2.clear();
    });

    it ('must add an instance of List and only add GameObject ones', function(){

      expect(stage.add).to.be.a('function');

      var list = new GameObjectList();

      var objTest = new TestObject();
      var testGM = new GameObject();

      var objTestLayered = new TestObject({ layer: 'testLayer1' });

      list.add([ objTest, testGM, objTestLayered ]);

      stage.addObjects(list);

      var layer0 = stage.get('default');
      var layer1 = stage.get('testLayer1');
      var layer2 = stage.get('testLayer2');

      expect(layer0.length).to.be.equal(2);
      expect(layer0.at(0).cid).to.be.equal(objTest.cid);

      expect(layer1.length).to.be.equal(1);
      expect(layer1.at(0).cid).to.be.equal(objTestLayered.cid);

      expect(layer2.length).to.be.equal(0);

      layer0.clear();
      layer1.clear();
      layer2.clear();
    });

  });

  describe('#removeObject', function(){

    it ('must remove objects from a layer', function(){

      var objTest = new TestObject();
      var objTestLayered = new TestObject({ layer: 'testLayer1' });

      var emitted = 0;
      stage.on('removeFromLayer', function(obj, layer){
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

      stage.ready();

      stage.removeObject(objTest);
      stage.removeObject(objTestLayered);
      expect(emitted).to.be.equal(2);

      emitted = 0;
      stage.clearLayer();
      expect(emitted).to.be.equal(0);
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

      expect(stage.isReady).to.be.equal(false);

    });

  });

  describe('#ready', function(){

    it('must throw a "layerFill" event for each contained layer', function(){

      stage.addObjects([
        // default layer
        new TestObject(),
        new TestObject(),

        // testLayer1
        new TestObject({ layer: 'testLayer1' }),
        new TestObject({ layer: 'testLayer1' }),

        // testLayer2
        new TestObject({ layer: 'testLayer2' }),
        new TestObject({ layer: 'testLayer2' }),
      ]);

      var layers = ['default', 'testLayer1', 'testLayer2'];
      var emitted = 0;

      stage.on('layerFill', function(layer){
        var idx = layers.indexOf(layer);
        expect(idx).to.be.above(-1);

        layers.splice(idx, 1);
        emitted++;
      });

      stage.ready();
      expect(emitted).to.be.equal(3);

      expect(stage.isReady).to.be.equal(true);

    });

  });

  describe('#getFrontObject', function(){

    it('must return an object with the highest zIndex at the last layer',
      function(){

      var layers = ['testLayer1', 'testLayer2', 'testLayer3'];

      var stage = Stage.create(layers);

      var objects = [
        // testLayer1
        new TestObject({ layer: 'testLayer1', zIndex: 2 }),
        new TestObject({ layer: 'testLayer1', zIndex: 1 }),

        // testLayer2
        new TestObject({ name: 'this one', layer: 'testLayer2', zIndex: 8 }),
        new TestObject({ layer: 'testLayer2', zIndex: 6 }),
      ];

      var objectsDefault = [
        // default layer
        new TestObject({ name: 'this default one', zIndex: 5 }),
        new TestObject({ zIndex: 2 }),
        new TestObject({ zIndex: 4 }),
      ];

      stage.addObjects(objects.concat(objectsDefault));

      var obj = stage.getFrontObject();
      expect(obj.name).to.be.equal('this default one');

      stage.clearLayer();
      stage.addObjects(objects);

      obj = stage.getFrontObject();
      expect(obj.name).to.be.equal('this one');

    });

  });

  describe('zIndex', function(){

    it('must fire [change:zIndex] when a Layer fires it', function(){

      var layers = ['testLayer1'];

      var stage = Stage.create(layers);

      var objects = [
        // testLayer1
        new TestObject({ layer: 'testLayer1', zIndex: 2 }),
        new TestObject({ layer: 'testLayer1', zIndex: 1 }),

        // default
        new TestObject({ name: 'this default one', zIndex: 5 }),
        new TestObject({ zIndex: 2 }),
      ];

      stage.addObjects(objects);

      var expectedLayer;
      var expectedObject;

      var called = 0;
      stage.on('zIndexChanged', function(obj, layer){
        called++;
        expect(obj).to.be.equal(expectedObject);
        expect(layer).to.be.equal(expectedLayer);
      });

      expectedLayer = 'testLayer1';
      expectedObject = objects[1];
      expectedObject.zIndex = 70;

      stage.update();

      expect(called).to.be.equal(0);

      stage.ready();

      expectedLayer = 'testLayer1';
      expectedObject = objects[1];
      expectedObject.zIndex = 5;

      stage.update();

      expect(called).to.be.equal(1);

      expectedLayer = 'default';
      expectedObject = objects[3];
      expectedObject.zIndex = 8;

      stage.update();

      expect(called).to.be.equal(2);
    });

  });

});
