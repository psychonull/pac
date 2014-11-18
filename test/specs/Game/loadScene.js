
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = pac.Renderer.extend({

  onLayerFill: function(){ },
  onLayerClear: function(){ },
  render: function(){}

});

var Monkey = pac.GameObject.extend({

  init: function(){
    this.changeTheScene = false;
  },

  update: function(){
    if (this.changeTheScene){
      this.game.loadScene('test2');
      expect(this.game.loadingScene).to.be.equal('test2');
    }
  },

  changeScene: function(){
    this.changeTheScene = true;
  }

});

var monkeyA, monkeyA2, monkeyB;

var MockSceneA = pac.Scene.extend({

  init: function(){ },
  onEnter: function(){
    this.addObject(monkeyA);
    this.addObject(monkeyA2);
  },
  onExit: function(){ },
  update: function(){}

});

var MockSceneB = pac.Scene.extend({

  init: function(){ },
  onEnter: function(){
    this.addObject(monkeyB);
  },
  onExit: function(){ },
  update: function(){}

});

describe('#loadScene', function(){

  before(function(){
    monkeyA = new Monkey({ name: 'monkeyA'});
    monkeyA2 = new Monkey({ name: 'monkeyA2'});
    monkeyB = new Monkey({ name: 'monkeyB'});

    sinon.spy(monkeyA, 'update');
    sinon.spy(monkeyA2, 'update');
    sinon.spy(monkeyB, 'update');

    sinon.spy(monkeyA, 'onEnterScene');
    sinon.spy(monkeyA2, 'onEnterScene');
    sinon.spy(monkeyB, 'onEnterScene');
  });

  it('must call update and draw in that order', function(done) {
    var fps = 10; // 10 updates per second
    var msOneFrame = 1000 / fps;

    var game = pac.create({
      fps: fps
    });

    game.use('renderer', MockRenderer, {
      size: { width: 100, height: 100 }
    });

    var scenes = {
      'test': new MockSceneA(),
      'test2': new MockSceneB()
    };

    game.use('scenes', scenes);

    var monkeyGM = new Monkey({ name: 'gameMonkey' });
    sinon.spy(monkeyGM, 'update');
    sinon.spy(monkeyGM, 'onEnterScene');

    game.on('ready', function(){
      this.addObject(monkeyGM);
    });

    sinon.spy(scenes.test, 'onEnter');
    sinon.spy(scenes.test, 'update');
    sinon.spy(scenes.test2, 'update');

    var updates = 0;
    game.on('update', function(dt){
      updates++;
    });

    game.start('test');

    expect(scenes.test.onEnter).to.have.been.called;
    expect(scenes.test.objects.length).to.be.equal(2);
    expect(monkeyGM.onEnterScene).to.have.been.calledOnce;

    setTimeout(function(){

      expect(monkeyGM.update).to.have.been.callCount(updates);
      expect(scenes.test.update).to.have.been.callCount(updates);
      expect(scenes.test2.update).to.not.have.been.called;

      expect(monkeyA.update).to.have.been.callCount(updates);
      expect(monkeyA2.update).to.have.been.callCount(updates);
      expect(monkeyB.update).to.not.have.been.called;

      expect(monkeyA.onEnterScene).to.not.have.been.called;
      expect(monkeyA2.onEnterScene).to.not.have.been.called;
      expect(monkeyB.onEnterScene).to.not.have.been.called;

      var lastUpdates = updates;
      updates = 0;

      monkeyA.changeScene();

      setTimeout(function(){
        game.end();

        // current scene is running last update
        expect(scenes.test.update).to.have.been.callCount(lastUpdates+1);

        // monkeyA is changing scene on that last update
        expect(monkeyA.update).to.have.been.callCount(lastUpdates+1);

        // monkeyA2 should not be called after monkeyA triggers a change scene
        expect(monkeyA2.update).to.have.been.callCount(lastUpdates);

        // Game.objects keeps runing on change scenes
        expect(monkeyGM.update).to.have.been.callCount(updates+lastUpdates);
        expect(monkeyGM.onEnterScene).to.have.been.calledTwice;

        // scene2 must have update called because the scene has changed
        expect(scenes.test2.update).to.have.been.called;

        // monkeyB should be called because it's in the scene2
        expect(monkeyB.update).to.have.been.called;

        // these are not at game level so don't get called onEnterScene
        expect(monkeyA.onEnterScene).to.not.have.been.called;
        expect(monkeyA2.onEnterScene).to.not.have.been.called;
        expect(monkeyB.onEnterScene).to.not.have.been.called;

        done();

      }, msOneFrame*3); // 3 frames

    }, msOneFrame); // one frame

  });

});