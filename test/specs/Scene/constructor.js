
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');

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
    expect(scene.objects).to.be.an('array');
    expect(scene.objects.length).to.be.equal(0);

    expect(scene.cid).to.be.a('string');
    expect(scene.cid.length).to.be.greaterThan(0);
    expect(scene.idAttribute).to.be.equal('name');

  });

  it('must throw an error if no arguments', function(){

    expect(function(){
      var scene = new Scene();
    }).to.throw('Cannot create an empty Scene: required name, size');

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
