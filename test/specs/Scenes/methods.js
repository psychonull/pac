
var Scenes = require('../../../src/Scenes');
var Scene = require('../../../src/Scene');

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

    scenes.add(new Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    }));

    expect(scenes.length).to.be.equal(1);
    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
  });

  it('must add Scenes by Scene instance array', function(){
    var scenes = new Scenes();

    var toAdd = [
      new Scene({
        name: 'Scene1',
        size: { width: 400, height: 500 }
      }),
      new Scene({
        name: 'Scene2',
        size: { width: 400, height: 500 }
      })
    ];

    scenes.add(toAdd);

    expect(scenes.length).to.be.equal(2);
    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.get('Scene2').name).to.be.equal('Scene2');
  });

  it('must set the first scene as current', function(){
    var scenes = new Scenes();

    scenes.add(new Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    }));

    expect(scenes.length).to.be.equal(1);
    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.current.name).to.be.equal('Scene1');

    var toAdd = [
      new Scene({
        name: 'Scene2',
        size: { width: 400, height: 500 }
      }),
      new Scene({
        name: 'Scene3',
        size: { width: 400, height: 500 }
      })
    ];

    scenes.add(toAdd);

    expect(scenes.length).to.be.equal(3);

    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.get('Scene2').name).to.be.equal('Scene2');
    expect(scenes.get('Scene3').name).to.be.equal('Scene3');
    
    expect(scenes.current.name).to.be.equal('Scene1');
  });

});

describe('#switch', function(){
  
  var scenes = new Scenes(),
    sceneStart = new Scene({
      name: 'start', 
      size: { width: 400, height: 500 }
    }),
    sceneX = new Scene({
      name: 'x', 
      size: { width: 400, height: 500 },
      onEnter: function(){},
      onLeave: function(){}
    }),
    sceneY = new Scene({
      name: 'y', 
      size: { width: 400, height: 500 },
      onEnter: function(){},
      onLeave: function(){}
    });

  scenes.add([sceneStart, sceneX, sceneY]);

  it('must exist switch method', function(){
    expect(scenes.switch).to.be.a('function');
    expect(scenes.current.name).to.equal(sceneStart.name);
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

      expect(scenes.current.name).to.equal('x');

      sinon.spy(sceneX, 'onEnter');
      sinon.spy(sceneX, 'onLeave');

      sinon.spy(sceneY, 'onEnter');
      sinon.spy(sceneY, 'onLeave');

      var emitScenesLeave = 0;
      var emitScenesEnter = 0;
      
      scenes.on('leave', function(scene){
        emitScenesLeave++;
        expect(scene.name).to.be.equal('x');
      });

      scenes.on('enter', function(scene){
        emitScenesEnter++;
        expect(scene.name).to.be.equal('y');
      });

      scenes.switch('y');

      expect(sceneX.onEnter).to.not.have.been.called;
      expect(sceneX.onLeave).to.have.been.called;

      expect(sceneY.onEnter).to.have.been.calledWith(sceneX);
      expect(sceneY.onLeave).to.not.have.been.called;

      expect(emitScenesEnter).to.be.equal(1);
      expect(emitScenesLeave).to.be.equal(1);

      sceneX.onEnter.restore();
      sceneX.onLeave.restore();
      sceneY.onEnter.restore();
      sceneY.onLeave.restore();
  });

});

describe('#get', function(){

  var scenes = new Scenes(),
    sceneX = new Scene({
      name: 'x', 
      size: { width: 400, height: 500 }
    }), 
    sceneY = new Scene({
      name: 'y', 
      size: { width: 400, height: 500 }
    });

  scenes.add([sceneX, sceneY]);

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

    var scene1 = new Scene({
      name: 'Scene1',
      size: { width: 400, height: 500 }
    });

    var scene2 = new Scene({
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
