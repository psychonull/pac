
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = pac.Renderer.extend({
  onStageAdd: function(obj){ },
  onStageClear: function(){ },
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

/* test Actions Update */

var MonkeyAction = pac.Action.extend({
  
  update: function(dt){
    this.actionList.owner.position.x = 1000 + dt;
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

    var monkeyX = new MonkeyX();
    var monkeyY = new MonkeyY();

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

    var firstSc = new pac.Scene({
      name: 'first',
      size: { width: 200, height: 300 }
    });

    sinon.spy(firstSc, 'update');

    firstSc.addObject([ monkeyX, monkeyY, monkeyActioner ]);

    game.scenes.add(firstSc);

    game.start();

    // let the game run for 50 ms
    setTimeout(function(){      
      game.end();

      expect(firstSc.update).to.have.been.called;
      expect(monkeyX.update).to.have.been.called;
      expect(monkeyY.update).to.have.been.called;
      expect(monkeyActioner.update).to.have.been.called;

      expect(monkeyActioner.updateActions).to.have.been.called;
      expect(monkeyAct.update).to.have.been.called;

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
    
    var spyStageAdd = sinon.spy(MockRenderer.prototype, 'onStageAdd');
    sinon.spy(MockRenderer.prototype, 'onStageClear');

    var game = pac.create({
      fps: 15
    });

    game.use('renderer', MockRenderer);

    var firstSc = new pac.Scene({
      name: 'first',
      size: { width: 200, height: 300 }
    });

    var secondSc = new pac.Scene({
      name: 'second',
      size: { width: 200, height: 300 }
    });

    var monkeyX = new MonkeyX();
    var monkeyY = new MonkeyY();
    firstSc.addObject([ monkeyX, monkeyY ]);

    var monkeyX2 = new MonkeyX();
    var monkeyY2 = new MonkeyY();
    secondSc.addObject([ monkeyX2, monkeyY2 ]);

    game.scenes.add(firstSc);
    game.scenes.add(secondSc);

    game.start();

    expect(game.renderer.onStageAdd).to.have.been.called;
    expect(game.renderer.onStageAdd).to.have.been.calledWith(monkeyX);
    expect(game.renderer.onStageAdd).to.have.been.calledWith(monkeyY);

    // let the game run for 50 ms
    setTimeout(function(){

      spyStageAdd.reset();
      game.scenes.switch('second');

      expect(game.renderer.onStageClear).to.have.been.called;

      expect(game.renderer.onStageAdd).to.have.been.called;
      expect(game.renderer.onStageAdd).to.have.been.calledWith(monkeyX2);
      expect(game.renderer.onStageAdd).to.have.been.calledWith(monkeyY2);

      game.end();

      game.renderer.onStageAdd.restore();
      game.renderer.onStageClear.restore();

      done();

    }, 50);

  });

});