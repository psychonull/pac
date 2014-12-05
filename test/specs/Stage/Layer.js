
var Layer = require('../../../src/Layer');
var GameObject = require('../../../src/GameObject');

var _ = require('../../../src/utils');

var expect = require('chai').expect;

describe('Layer', function(){

  it('must keep track of old GameObjects zIndex', function(){
    var layer = new Layer();

    expect(_.keys(layer.zIndexByCID).length).to.be.equal(0);

    var obj = new GameObject({ zIndex: 1 });
    var obj2 = new GameObject({ zIndex: 2 });
    var obj3 = new GameObject({ zIndex: 20 });

    layer.add([ obj, obj2, obj3 ]);
    expect(layer.length).to.be.equal(3);
    expect(_.keys(layer.zIndexByCID).length).to.be.equal(3);

    expect(layer.at(0)).to.be.equal(obj);
    expect(layer.at(1)).to.be.equal(obj2);
    expect(layer.at(2)).to.be.equal(obj3);

    expect(layer.zIndexByCID[obj.cid]).to.be.equal(1);
    expect(layer.zIndexByCID[obj2.cid]).to.be.equal(2);
    expect(layer.zIndexByCID[obj3.cid]).to.be.equal(20);

    layer.remove(obj2);
    expect(_.keys(layer.zIndexByCID).length).to.be.equal(2);
    expect(layer.zIndexByCID[obj.cid]).to.be.equal(1);
    expect(layer.zIndexByCID[obj3.cid]).to.be.equal(20);

    layer.clear();
    expect(_.keys(layer.zIndexByCID).length).to.be.equal(0);
  });

  it('must manage zIndex changes on GameObjects contained', function(){

    var layer = new Layer();

    var obj = new GameObject({ zIndex: 1 });
    var obj2 = new GameObject({ zIndex: 2 });
    var obj3 = new GameObject({ zIndex: 20 });

    layer.add([ obj, obj2, obj3 ]);
    expect(layer.length).to.be.equal(3);

    expect(layer.at(0)).to.be.equal(obj);
    expect(layer.at(1)).to.be.equal(obj2);

    var newZIndex;

    var called = 0;
    layer.on('change:zIndex', function(obj){
      called++;
      expect(obj.zIndex).to.be.equal(newZIndex);
    });

    newZIndex = 5;
    obj.zIndex = newZIndex;

    layer.update();

    expect(called).to.be.equal(1);
    expect(layer.at(0)).to.be.equal(obj2);
    expect(layer.at(1)).to.be.equal(obj);

    newZIndex = 10;
    obj2.zIndex = newZIndex;

    layer.update();

    expect(called).to.be.equal(2);
    expect(layer.at(0)).to.be.equal(obj);
    expect(layer.at(1)).to.be.equal(obj2);

    layer.remove(obj);
    obj.zIndex = 100;

    layer.update();

    expect(called).to.be.equal(2);

    layer.clear();
    obj2.zIndex = 15;
    obj3.zIndex = 30;

    layer.update();

    expect(called).to.be.equal(2);
  });

});
