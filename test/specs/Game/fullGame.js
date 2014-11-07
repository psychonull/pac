
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
  onLayerFill: function(layer){ },
  onLayerClear: function(layer){ },
  render: function(){ }
});

var MonkeyX = pac.Drawable.extend({

  update: function(dt){
    this.position.x += dt;
  }

});

var MonkeyY = pac.Drawable.extend({

  update: function(dt){
    this.position.y += dt;
  }

});

var MonkeySprite = pac.Sprite.extend({
  texture: 'monkey'
});

/* test Actions Update */

var MonkeyAction = pac.Action.extend({

  update: function(dt){
    this.actions.owner.position.x = 1000 + dt;
  }

});

var MonkeyActioner = pac.Drawable.extend();

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

    sinon.spy(game.inputs, 'update');

    var monkeyX = new MonkeyX();
    var monkeyY = new MonkeyY();
    var monkeySP = new MonkeySprite();

    /* test Actions Update */
    var monkeyAct = new MonkeyAction();
    var monkeyActioner = new MonkeyActioner({
      actions: [ monkeyAct ]
    });

    sinon.spy(monkeyX, 'update');
    sinon.spy(monkeyY, 'update');

    /* test Actions Update */
    sinon.spy(monkeyActioner, 'update');
    sinon.spy(monkeyAct, 'update');
    sinon.spy(monkeyActioner, 'updateActions');

    /* test animations */
    sinon.spy(monkeySP, 'updateAnimations');
    sinon.spy(monkeySP, 'update');

    var firstSc = new pac.Scene({
      name: 'first',
      size: { width: 200, height: 300 }
    });

    sinon.spy(firstSc, 'update');

    firstSc.addObject([ monkeyX, monkeyY, monkeyActioner, monkeySP ]);

    game.scenes.add(firstSc);

    game.start();

    // let the game run for 50 ms
    setTimeout(function(){
      game.end();

      expect(game.inputs.update).to.have.been.called;

      expect(firstSc.update).to.have.been.called;
      expect(monkeyX.update).to.have.been.called;
      expect(monkeyY.update).to.have.been.called;
      expect(monkeyActioner.update).to.have.been.called;
      expect(monkeyActioner.update).to.have.been.called;

      /* check updateActions */
      expect(monkeyActioner.updateActions).to.have.been.called;
      expect(monkeyAct.update).to.have.been.called;

      /* check updateAnimations */
      expect(monkeySP.updateAnimations).to.have.been.called;
      expect(monkeySP.update).to.have.been.called;

      expect(monkeyX.position.x).to.be.greaterThan(0);
      expect(monkeyX.position.y).to.be.equal(0);

      expect(monkeyY.position.x).to.be.equal(0);
      expect(monkeyY.position.y).to.be.greaterThan(0);

      expect(monkeyActioner.position.x).to.be.greaterThan(1000);

      firstSc.update.restore();
      monkeyX.update.restore();
      monkeyY.update.restore();

      done();

    }, 50);

  });

});

describe('Full Draw', function(){

  it('must engage the Scene with the renderer', function(done) {

    sinon.spy(MockRenderer.prototype, 'setBackTexture');
    sinon.spy(MockRenderer.prototype, 'clearBackTexture');
    var spyLayerFill = sinon.spy(MockRenderer.prototype, 'onLayerFill');
    sinon.spy(MockRenderer.prototype, 'onLayerClear');

    var game = pac.create({
      fps: 15
    });

    game.use('renderer', MockRenderer, {
      layers: [ 'monkeys', 'monkeys2' ]
    });

    var firstSc = new pac.Scene({
      name: 'first',
      texture: 'first_scene_texture',
      size: { width: 200, height: 300 }
    });

    var secondSc = new pac.Scene({
      name: 'second',
      texture: 'second_scene_texture',
      size: { width: 200, height: 300 }
    });

    var monkeyX = new MonkeyX({ layer: 'monkeys', zIndex: 2 });
    var monkeyY = new MonkeyY({ layer: 'monkeys', zIndex: 1 });
    firstSc.addObject([ monkeyX, monkeyY ]);

    var monkeyX2 = new MonkeyX({ layer: 'monkeys2', zIndex: 4 });
    var monkeyY2 = new MonkeyY({ layer: 'monkeys2', zIndex: 3 });
    secondSc.addObject([ monkeyX2, monkeyY2 ]);

    game.scenes.add(firstSc);
    game.scenes.add(secondSc);

    game.start();

    expect(game.renderer.setBackTexture)
      .to.have.been.calledWith(firstSc.texture);

    expect(game.renderer.onLayerFill).to.have.been.calledThrice;
    expect(game.renderer.onLayerFill).to.have.been.calledWith('default');
    expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys');
    expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys2');

    var stage = game.renderer.stage;

    expect(stage.get('default').length).to.be.equal(0);

    expect(stage.get('monkeys').length).to.be.equal(2);
    expect(stage.get('monkeys').at(0).cid).to.be.equal(monkeyY.cid);
    expect(stage.get('monkeys').at(1).cid).to.be.equal(monkeyX.cid);

    expect(stage.get('monkeys2').length).to.be.equal(0);

    // let the game run for 50 ms
    setTimeout(function(){

      spyLayerFill.reset();

      game.scenes.switch('second');

      expect(game.renderer.clearBackTexture).to.have.been.called;
      expect(game.renderer.onLayerClear).to.have.been.called;

      expect(game.renderer.setBackTexture)
        .to.have.been.calledWith(secondSc.texture);

      expect(game.renderer.onLayerFill).to.have.been.calledThrice;
      expect(game.renderer.onLayerFill).to.have.been.calledWith('default');
      expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys');
      expect(game.renderer.onLayerFill).to.have.been.calledWith('monkeys2');

      expect(stage.get('default').length).to.be.equal(0);
      expect(stage.get('monkeys').length).to.be.equal(0);

      expect(stage.get('monkeys2').length).to.be.equal(2);
      expect(stage.get('monkeys2').at(0).cid).to.be.equal(monkeyY2.cid);
      expect(stage.get('monkeys2').at(1).cid).to.be.equal(monkeyX2.cid);

      game.end();

      game.renderer.onLayerFill.restore();
      game.renderer.onLayerClear.restore();

      done();

    }, 50);

  });

});