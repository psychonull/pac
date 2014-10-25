
var pac = require('../../../src/pac');
var Scenes = require('../../../src/Scenes');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

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

  it('must set the first scene as current', function(){
    var scenes = new Scenes();

    scenes.add(new pac.Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    }));

    expect(scenes._scenes.length).to.be.equal(1);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
    expect(scenes.current.name).to.be.equal('Scene1');

    var toAdd = [
      new pac.Scene({
        name: 'Scene2',
        size: { width: 400, height: 500 }
      }),
      new pac.Scene({
        name: 'Scene3',
        size: { width: 400, height: 500 }
      })
    ];

    scenes.add(toAdd);

    expect(scenes._scenes.length).to.be.equal(3);
    expect(scenes._scenes[0].name).to.be.equal('Scene1');
    expect(scenes._scenes[1].name).to.be.equal('Scene2');
    expect(scenes._scenes[2].name).to.be.equal('Scene3');
    
    expect(scenes.current.name).to.be.equal('Scene1');
  });

});

describe('#switch', function(){
  
  var scenes = new Scenes(),
    sceneX = {name: 'x', emit: sinon.spy()},
    sceneY = {name: 'y', emit: sinon.spy()};

  scenes._scenes = [sceneX, sceneY];

  it('must exist load method', function(){
    expect(scenes.switch).to.be.a('function');
    expect(scenes.current).to.equal(null);
  });

  it('must set it as current by name', function(){
    scenes.switch('x');
    expect(scenes.current.name).to.equal('x');
  });

  it('must throw an error if scene name does not exist', function(){
    expect(function(){

      scenes.switch('z');

    }).to.throw('Scene not found: "z"');
  });

  it('must emit "enter" in the new scene and "leave" in the previous',
    function(){
      scenes.switch('y');
      expect(sceneX.emit).to.have.been.calledWith('leave');
      expect(sceneY.emit).to.have.been.calledWith('enter');
    }
  );

});

describe('#get', function(){
  var scenes = new Scenes(),
    sceneX = {name: 'x'};
  scenes._scenes = [sceneX];

  it('must return the scene by name', function(){
    expect(scenes.get('x')).to.equal(sceneX);
  });

  it('must return null if not found', function(){
    expect(scenes.get('xxx')).to.be.null;
  });

});

describe('#update', function(){

  it('must exist update method', function(){
    var scenes = new Scenes();
    expect(scenes.update).to.be.a('function');
  });

  it('must call update for current scene', function(){
    
    var scenes = new Scenes();

    var scene1 = new pac.Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    });

    var scene2 = new pac.Scene({
      name: 'Scene2',
      size: { width: 400, height: 500 }
    });
    
    sinon.spy(scene1, 'update');
    sinon.spy(scene2, 'update');

    scenes.add([scene1, scene2]);

    var dt = 0.16;
    scenes.update(dt);

    expect(scene1.update).to.have.been.calledOnce;
    expect(scene2.update).to.not.have.been.called;

    expect(scene1.update).to.have.been.calledWith(dt);

    scene1.update.restore();
    scene2.update.restore();
  });

});