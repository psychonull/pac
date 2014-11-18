
var Scene = require('../../../src/Scene');
var List = require('../../../src/List');
var GameObjectList = require('../../../src/GameObjectList');

var expect = require('chai').expect;

var TestScene = Scene.extend({

  texture: 'testTexture',
  size: { width: 500, height: 600 },

  init: function(options){
    this.myProp = options && options.myProp;
  }

});

describe('Constructor', function(){

  it('must allow to create an scene', function(){

    var scene = new TestScene({
      name: 'Scene01',
      myProp: 666
    });

    expect(scene.name).to.be.equal('Scene01');
    expect(scene.size.width).to.be.equal(500);
    expect(scene.size.height).to.be.equal(600);
    expect(scene.texture).to.be.equal('testTexture');

    expect(scene.myProp).to.be.equal(666);

    expect(scene.objects).to.be.instanceof(GameObjectList);
    expect(scene.objects.length).to.be.equal(0);

    expect(scene.cid).to.be.a('string');
    expect(scene.cid.length).to.be.greaterThan(0);

    expect(scene.onEnter).to.be.a('function');
    expect(scene.onExit).to.be.a('function');
    expect(scene.update).to.be.a('function');

  });

  it('must allow to set a texture', function(){

    var name = 'Scene01';
    var texture = 'scene_01';
    var size = { width: 500, height: 600 };

    var scene = new Scene({
      name: name,
      texture: texture,
      size: size
    });

    expect(scene.name).to.be.equal(name);
    expect(scene.size).to.be.equal(size);
    expect(scene.texture).to.be.equal(texture);
    expect(scene.objects.length).to.be.equal(0);

    expect(scene.cid).to.be.a('string');
    expect(scene.cid.length).to.be.greaterThan(0);

  });

  it('must allow to inherit from a scene', function(){

    var FunScene = Scene.extend({
      name: 'FunScene',
      size: { width: 500, height: 600 },
      texture: 'woods'
    });

    var scene = new FunScene();

    expect(scene.name).to.be.equal('FunScene');
    expect(scene.size.width).to.be.equal(500);
    expect(scene.texture).to.be.equal('woods');
    expect(scene.objects.length).to.be.equal(0);

    expect(scene.cid).to.be.a('string');
    expect(scene.cid.length).to.be.greaterThan(0);
  });

});
