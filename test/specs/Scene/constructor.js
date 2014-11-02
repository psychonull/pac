
var Scene = require('../../../src/Scene');
var List = require('../../../src/List');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('must create an scene', function(){

    var name = 'Scene01';
    var size = { width: 500, height: 600 };

    var scene = new Scene({
      name: name,
      size: size
    });

    expect(scene.name).to.be.equal(name);
    expect(scene.size).to.be.equal(size);
    expect(scene.objects.length).to.be.equal(0);
  });

  it('must allow to inherit from a scene', function(){

    var FunScene = Scene.extend({
      name: 'FunScene',
      size: { width: 500, height: 600 }
    });

    var scene = new FunScene();

    expect(scene.name).to.be.equal('FunScene');
    expect(scene.size.width).to.be.equal(500);
    expect(scene.objects.length).to.be.equal(0);

  });

  it('must throw an error if name is not provided', function(){

    expect(function(){

      var scene = new Scene({
        size: { width: 500, height: 600 }
      });

    }).to.throw('Cannot create scene : "name" is required');

  });

  it('must throw an error if size is not provided', function(){

    expect(function(){

      var scene = new Scene({
        name: 'Scene01'
      });

    }).to.throw('Cannot create scene Scene01: "size" is required');

  });

});
