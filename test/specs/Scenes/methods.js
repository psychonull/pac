
var pac = require('../../../src/pac');
var Scenes = require('../../../src/Scenes');
var expect = require('chai').expect;

describe('#add', function(){

  it('must exist add method', function(){
    var scenes = new Scenes();
    expect(scenes.add).to.be.a('function');
  });

  it('must add an Scene by options', function(){
    var scenes = new Scenes();

    scenes.add({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    });

    expect(scenes._scenes.length).to.be.equal(1);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
  });

  it('must add an Scene by a pac.Scene instance', function(){
    var scenes = new Scenes();

    scenes.add(new pac.Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    }));

    expect(scenes._scenes.length).to.be.equal(1);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
  });

  it('must add Scenes by options array', function(){
    var scenes = new Scenes();

    scenes.add([{
      name: 'Scene1',
      size: { width: 400, height: 500 }
    }, {
      name: 'Scene2',
      size: { width: 500, height: 600 }
    }]);

    expect(scenes._scenes.length).to.be.equal(2);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
    expect(scenes._scenes[1].name).to.be.equal('Scene2');
  });

  it('must add Scenes by pac.Scene instance array', function(){
    var scenes = new Scenes();

    var toAdd = [
      new pac.Scene({
        name: 'Scene1',
        size: { width: 400, height: 500 }
      }), 
      new pac.Scene({
        name: 'Scene2',
        size: { width: 400, height: 500 }
      })
    ];

    scenes.add(toAdd);

    expect(scenes._scenes.length).to.be.equal(2);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
    expect(scenes._scenes[1].name).to.be.equal('Scene2');
  });

  it('must throw an error if required prop is not provided', function(){
    var scenes = new Scenes();

    expect(function(){
      
      scenes.add(new pac.Scene({
        name: 'Scene1',
      }));

    }).to.throw('Cannot create scene Scene1: "size" is required');

  });

  it('must throw an error if required prop is not provided in an array', 
    function(){

      var scenes = new Scenes();

      expect(function(){
        
        scenes.add([{
          name: 'Scene1',
          size: { width: 400, height: 500 }
        }, {
          name: 'Scene2',
        }]);

      }).to.throw('Cannot create scene Scene2: "size" is required');

  });

});

describe('#load', function(){

  it('must exist load method', function(){
    var scenes = new Scenes();
    expect(scenes.load).to.be.a('function');
  });

  it('must init an scene and set it as current by name');
  it('must throw an error if scene name does not exist');

  it('must clean previous scene if any');

});
