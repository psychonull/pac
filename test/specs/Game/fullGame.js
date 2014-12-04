
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = pac.Renderer.extend({
  init: function(){
    this.viewport = document.createElement('canvas');
  },
  onAddObject: function(obj, layer){ },
  onRemoveObject: function(obj, layer){ },
  onLayerFill: function(layer){ },
  onLayerClear: function(layer){ },
  render: function(){ }
});

var MonkeyX = pac.GameObject.extend({

  update: function(dt){
    this.position.x += dt;
  }

});

var MonkeyY = pac.GameObject.extend({

  update: function(dt){
    this.position.y += dt;
  }

});

var MonkeySprite = pac.Sprite.extend({
  texture: 'monkey'
});

var Dummy = pac.Sprite.extend({
  texture: 'monkey'
});

/* test Actions Update */

var MonkeyAction = pac.Action.extend({

  update: function(dt){
    this.actions.owner.position.x = 1000 + dt;
  }

});

var MonkeyActioner = pac.GameObject.extend();

var Scene1 = pac.Scene.extend({

  texture: 'first_scene_texture',

  init: function(){ },

  onEnter: function(){

    var monkeyX = new MonkeyX({
      layer: 'monkeys',
      zIndex: 2,
      name: 'monkeyX'
    });

    var monkeyY = new MonkeyY({
      layer: 'monkeys',
      zIndex: 1,
      name: 'monkeyY'
    });

    var monkeySP = new MonkeySprite({
      name: 'monkeySP'
    });

    /* test Actions Update */
    var monkeyAct = new MonkeyAction();

    var monkeyActioner = new MonkeyActioner({
      name: 'monkeyActioner',
      actions: [ monkeyAct ]
    });

    sinon.spy(monkeyX, 'update');
    sinon.spy(monkeyY, 'update');

    /* test Actions Update */
    sinon.spy(monkeyActioner, 'update');
    sinon.spy(monkeyActioner, 'updateActions');

    /* test animations */
    sinon.spy(monkeySP, 'updateAnimations');
    sinon.spy(monkeySP, 'update');

    this.addObject([ monkeyX, monkeyY, monkeyActioner, monkeySP ]);

    expect(monkeyY.scene).to.be.ok;
    expect(monkeyY.scene).to.be.equal(this);

    expect(monkeyY.game).to.be.ok;
    expect(monkeyY.game).to.be.equal(this.game);

  },

  onExit: function(){

    var monkeyX = this.findOne('monkeyX');
    var monkeyY = this.findOne('monkeyY');
    var monkeySP = this.findOne('monkeySP');
    var monkeyActioner = this.findOne('monkeyActioner');

    /* check normal update */
    expect(monkeyX.update).to.have.been.called;
    expect(monkeyY.update).to.have.been.called;

    expect(monkeyX.position.x).to.be.greaterThan(0);
    expect(monkeyX.position.y).to.be.equal(0);

    expect(monkeyY.position.x).to.be.equal(0);
    expect(monkeyY.position.y).to.be.greaterThan(0);

    /* check updateAnimations */
    expect(monkeySP.updateAnimations).to.have.been.called;
    expect(monkeySP.update).to.have.been.called;

    /* check updateActions */
    expect(monkeyActioner.update).to.have.been.called;
    expect(monkeyActioner.updateActions).to.have.been.called;
    expect(monkeyActioner.position.x).to.be.greaterThan(1000);
  },

  update: function(){}

});

var Scene2 = pac.Scene.extend({

  texture: 'second_scene_texture',

  init: function(){ },

  onEnter: function(){
    this.addObject(new MonkeyX({
      name: 'monkeyX',
      layer: 'monkeys2',
      zIndex: 4
    }));

    this.addObject(new MonkeyY({
      name: 'monkeyY',
      layer: 'monkeys2',
      zIndex: 3
    }));
  },

  onExit: function(){ },
  update: function(){}

});

/*
  Test an update gameloop event from game to an scene object.
*/

describe('Full Update', function(){

  it('must call the update method of a GameObject', function(done) {

    var game = pac.create({
      fps: 15
    });

    game.use('renderer', MockRenderer);
    game.use('input', pac.MouseInput);

    var scenes = {
      'firstSc': new Scene1(),
      'secondSc': new Scene2(),
    };

    game.use('scenes', scenes);

    sinon.spy(game.inputs, 'update');

    sinon.spy(scenes.firstSc, 'onEnter');
    sinon.spy(scenes.firstSc, 'onExit');

    sinon.spy(scenes.secondSc, 'onEnter');
    sinon.spy(scenes.secondSc, 'onExit');

    expect(scenes.firstSc.game).to.be.ok;
    expect(scenes.firstSc.game).to.be.equal(game);

    var gameMonkey = new MonkeyY({ name: 'monkey_game' });
    sinon.spy(gameMonkey, 'update');
    //sinon.spy(gameMonkey, 'reset');

    var startEmitted = 0;
    game.on('ready', function(){

      // first call game start before the scene onEnter
      expect(scenes.firstSc.onEnter).to.not.have.been.called;
      expect(this).to.be.equal(game);

      this.addObject(gameMonkey);
      expect(gameMonkey.game).to.be.equal(this);
      expect(gameMonkey.scene).to.be.null;

      startEmitted++;
    });

    game.start('firstSc');
    expect(startEmitted).to.be.equal(1);

    // let the game run for 50 ms
    setTimeout(function(){

      //change Scene to test expects onExit
      game.loadScene('secondSc');

      // let the game run for 50 ms more
      setTimeout(function(){

        game.end();

        expect(game.inputs.update).to.have.been.called;

        expect(gameMonkey.update).to.have.been.called;

        expect(scenes.firstSc.onEnter).to.have.been.calledOnce;
        expect(scenes.firstSc.onExit).to.have.been.calledOnce;

        expect(scenes.secondSc.onEnter).to.have.been.calledOnce;
        expect(scenes.secondSc.onExit).to.not.have.been.called;

        game.inputs.update.restore();
        gameMonkey.update.restore();

        done();

      }, 50);

    }, 50);

  });

});

describe('Full Draw', function(){

  it('must engage the Scene with the renderer', function(done) {

    sinon.spy(MockRenderer.prototype, 'setBackTexture');
    sinon.spy(MockRenderer.prototype, 'clearBackTexture');

    sinon.spy(MockRenderer.prototype, 'onAddObject');
    sinon.spy(MockRenderer.prototype, 'onRemoveObject');

    var spyLayerFill = sinon.spy(MockRenderer.prototype, 'onLayerFill');
    sinon.spy(MockRenderer.prototype, 'onLayerClear');

    var game = pac.create({
      fps: 15
    });

    game.use('renderer', MockRenderer, {
      layers: [ 'monkeys', 'monkeys2' ],
      size: { width: 200, height: 300 }
    });

    var scenes = {
      'firstSc': new Scene1(),
      'secondSc': new Scene2(),
    };

    game.use('scenes', scenes);

    var gameMonkey = new MonkeyY({
      name: 'monkey_game',
      layer: 'monkeys',
      zIndex: 3
    });

    game.on('ready', function(){
      this.addObject(gameMonkey);
    });

    game.start('firstSc');

    expect(game.renderer.setBackTexture)
      .to.have.been.calledWith(scenes.firstSc.texture);

    expect(game.renderer.onLayerFill).to.have.been.calledThrice;
    expect(game.renderer.onLayerFill).to.have.been.calledWith('default');
    expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys');
    expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys2');

    var stage = game.renderer.stage;

    // monkeyActioner & monkeySP
    expect(stage.get('default').length).to.be.equal(2);

    var monkeyY = scenes.firstSc.findOne('monkeyY');
    var monkeyX = scenes.firstSc.findOne('monkeyX');

    expect(stage.get('monkeys').length).to.be.equal(3);
    expect(stage.get('monkeys').at(0).cid).to.be.equal(monkeyY.cid);
    expect(stage.get('monkeys').at(1).cid).to.be.equal(monkeyX.cid);
    expect(stage.get('monkeys').at(2).cid).to.be.equal(gameMonkey.cid);

    expect(stage.get('monkeys2').length).to.be.equal(0);

    // let the game run for 50 ms
    setTimeout(function(){

      spyLayerFill.reset();

      game.loadScene('secondSc');

      // let the game run for 50 ms more
      setTimeout(function(){

        expect(game.renderer.clearBackTexture).to.have.been.called;
        expect(game.renderer.onLayerClear).to.have.been.called;

        expect(game.renderer.setBackTexture)
          .to.have.been.calledWith(scenes.secondSc.texture);

        expect(game.renderer.onLayerFill).to.have.been.calledThrice;
        expect(game.renderer.onLayerFill).to.have.been.calledWith('default');
        expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys');
        expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys2');

        expect(stage.get('default').length).to.be.equal(0);
        expect(stage.get('monkeys').length).to.be.equal(1);

        expect(stage.get('monkeys').at(0).cid).to.be.equal(gameMonkey.cid);

        var monkeyY2 = scenes.secondSc.findOne('monkeyY');
        var monkeyX2 = scenes.secondSc.findOne('monkeyX');

        expect(stage.get('monkeys2').length).to.be.equal(2);
        expect(stage.get('monkeys2').at(0).cid).to.be.equal(monkeyY2.cid);
        expect(stage.get('monkeys2').at(1).cid).to.be.equal(monkeyX2.cid);

        //////////////////////////////////////////////////////
        //Test add and remove of Dynamic objects

        expect(game.renderer.onAddObject).to.not.have.been.called;
        expect(game.renderer.onRemoveObject).to.not.have.been.called;

        // add objects to Game and Scene
        var gameObjA = new Dummy({ name: 'gameDummy_A' });
        var gameObjB = new Dummy({ name: 'gameDummy_B' });

        game.addObject([gameObjA, gameObjB]);

        var sceneObjA = new Dummy({ name: 'sceneDummy_A' });
        var sceneObjB = new Dummy({ name: 'sceneDummy_B' });

        scenes.secondSc.addObject([ sceneObjA, sceneObjB ]);

        // remove objects to Game and Scene
        game.removeObject(gameObjB);
        scenes.secondSc.removeObject(sceneObjB);

        // let the game run for 50 ms more
        setTimeout(function(){

          expect(game.renderer.onAddObject).to.have.been.callCount(4);
          expect(game.renderer.onRemoveObject).to.have.been.callCount(2);

          game.end();

          game.renderer.onLayerFill.restore();
          game.renderer.onLayerClear.restore();

          done();

        }, 50);
      }, 50);
    }, 50);

  });

});