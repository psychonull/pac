
var Layer = require('../../../src/Layer');
var GameObject = require('../../../src/GameObject');

var expect = require('chai').expect;

describe('Layer', function(){

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
    obj.setZIndex(newZIndex);

    expect(called).to.be.equal(1);
    expect(layer.at(0)).to.be.equal(obj2);
    expect(layer.at(1)).to.be.equal(obj);

    newZIndex = 10;
    obj2.setZIndex(newZIndex);

    expect(called).to.be.equal(2);
    expect(layer.at(0)).to.be.equal(obj);
    expect(layer.at(1)).to.be.equal(obj2);

    layer.remove(obj);
    obj.setZIndex(100);
    expect(called).to.be.equal(2);

    layer.clear();
    obj2.setZIndex(15);
    obj3.setZIndex(30);
    expect(called).to.be.equal(2);
  });

});
