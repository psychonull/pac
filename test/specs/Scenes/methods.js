
var Scenes = require('../../../src/Scenes');
var Scene = require('../../../src/Scene');
var GameObject = require('../../../src/GameObject');

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
    var fakeGame = { test: true };

    var scenes = new Scenes(null, {
      game: fakeGame,
      size: { width: 200, height: 500 }
    });

    scenes.add('Scene1', new Scene());

    expect(scenes.length).to.be.equal(1);
    expect(scenes.game).to.be.equal(fakeGame);

    var scene = scenes.get('Scene1');
    expect(scene.name).to.be.equal('Scene1');
    expect(scene.game).to.be.equal(fakeGame);
    expect(scene.size.width).to.be.equal(200);
    expect(scene.size.height).to.be.equal(500);
  });

  it('must add Scenes by constructor', function(){
    var fakeGame = { test: true };

    var scenes = new Scenes({
      'Scene1': new Scene({
        size: { width: 400, height: 500 }
      }),
      'Scene2': new Scene()
    }, {
      game: fakeGame,
      size: { width: 100, height: 200 }
    });

    expect(scenes.length).to.be.equal(2);
    var scene1 = scenes.get('Scene1');
    var scene2 = scenes.get('Scene2');

    expect(scene1.name).to.be.equal('Scene1');
    expect(scene2.name).to.be.equal('Scene2');

    expect(scene1.game).to.be.equal(fakeGame);
    expect(scene2.game).to.be.equal(fakeGame);

    expect(scene1.size.width).to.be.equal(400);
    expect(scene1.size.height).to.be.equal(500);

    expect(scene2.size.width).to.be.equal(100);
    expect(scene2.size.height).to.be.equal(200);
  });

  it('must add Scenes by Scene instance object', function(){
    var scenes = new Scenes();

    var toAdd = {
      'Scene1': new Scene({
        size: { width: 400, height: 500 }
      }),
      'Scene2': new Scene({
        size: { width: 400, height: 500 }
      })
    };

    scenes.add(toAdd);

    expect(scenes.length).to.be.equal(2);
    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.get('Scene2').name).to.be.equal('Scene2');
  });

  it('must not set the first scene as current', function(){
    var scenes = new Scenes();

    scenes.add('Scene1', new Scene({
      size: { width: 400, height: 500 }
    }));

    expect(scenes.length).to.be.equal(1);
    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.current).to.be.null;

    var toAdd = {
      'Scene2': new Scene({
        size: { width: 400, height: 500 }
      }),
      'Scene3': new Scene({
        size: { width: 400, height: 500 }
      })
    };

    scenes.add(toAdd);

    expect(scenes.length).to.be.equal(3);

    expect(scenes.get('Scene1').name).to.be.equal('Scene1');
    expect(scenes.get('Scene2').name).to.be.equal('Scene2');
    expect(scenes.get('Scene3').name).to.be.equal('Scene3');

    expect(scenes.current).to.be.null;
  });

});

describe('#switch', function(){

  var sharedCID, sharedCID2;
  var scenes = new Scenes(),

    SceneStart = Scene.extend({
      size: { width: 400, height: 500 }
    }),

    SceneX = Scene.extend({
      size: { width: 400, height: 500 },
      onEnter: function(){
        var obj = new GameObject();
        this.addObject(obj);
        sharedCID = obj.cid;

        var obj2 = new GameObject();
        this.addObject(obj2);
        sharedCID2 = obj2.cid;
      },
      onExit: function(to){
        to.addObject(this.objects.get(sharedCID2));
      }
    }),

    SceneY = Scene.extend({
      size: { width: 400, height: 500 },
      onEnter: function(scene){
        this.addObject(scene.objects.get(sharedCID));
      },
      onExit: function(){}
    });

  var sceneStart = new SceneStart();
  var sceneX = new SceneX();
  var sceneY = new SceneY();

  scenes.add({
    start: sceneStart,
    x: sceneX,
    y: sceneY
  });

  it('must exist switch method', function(){
    expect(scenes.switch).to.be.a('function');
    scenes.switch('start');
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

  it('must emit "enter" in the new scene and "exit" in the previous',
    function(){

      expect(scenes.current.name).to.equal('x');

      sinon.spy(sceneX, 'onEnter');
      sinon.spy(sceneX, 'onExit');

      sinon.spy(sceneY, 'onEnter');
      sinon.spy(sceneY, 'onExit');

      var emitScenesExit = 0;
      var emitScenesEnter = 0;

      scenes.on('exit', function(scene){
        emitScenesExit++;
        expect(scene.name).to.be.equal('x');
      });

      scenes.on('enter', function(scene){
        emitScenesEnter++;
        expect(scene.name).to.be.equal('y');
      });

      expect(sceneX.objects.length).to.be.equal(2);
      expect(sceneY.objects.length).to.be.equal(0);

      scenes.switch('y');

      expect(sceneX.onEnter).to.not.have.been.called;
      expect(sceneX.onExit).to.have.been.calledWith(sceneY);

      expect(sceneY.onEnter).to.have.been.calledWith(sceneX);
      expect(sceneY.onExit).to.not.have.been.called;

      expect(emitScenesEnter).to.be.equal(1);
      expect(emitScenesExit).to.be.equal(1);

      expect(sceneX.objects.length).to.be.equal(0);
      expect(sceneY.objects.length).to.be.equal(2);

      var passed = sceneY.find('GameObject');
      expect(passed.at(1).cid).to.be.equal(sharedCID);
      expect(passed.at(0).cid).to.be.equal(sharedCID2);

      sceneX.onEnter.restore();
      sceneX.onExit.restore();
      sceneY.onEnter.restore();
      sceneY.onExit.restore();
  });

});

describe('#get', function(){

  var scenes = new Scenes(),
    sceneX = new Scene({
      size: { width: 400, height: 500 }
    }),
    sceneY = new Scene({
      size: { width: 400, height: 500 }
    });

  scenes.add({
    x: sceneX,
    y: sceneY
  });

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

  it('must call _update for current scene', function(){

    var scenes = new Scenes();

    var scene1 = new Scene({
      size: { width: 400, height: 500 }
    });

    var scene2 = new Scene({
      size: { width: 400, height: 500 }
    });

    sinon.spy(scene1, '_update');
    sinon.spy(scene2, '_update');

    scenes.add({
      'Scene1': scene1,
      'Scene2': scene2
    });

    scenes.switch('Scene1');

    var dt = 0.16;
    scenes.update(dt);

    expect(scene1._update).to.have.been.calledOnce;
    expect(scene2._update).to.not.have.been.called;

    expect(scene1._update).to.have.been.calledWith(dt);

    scene1._update.restore();
    scene2._update.restore();
  });

});
