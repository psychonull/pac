
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var MockRenderer = pac.Renderer.extend({
  render: function(){}
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

    sinon.spy(monkeyX, 'update');
    sinon.spy(monkeyY, 'update');

    var firstSc = new pac.Scene({
      name: 'first',
      size: { width: 200, height: 300 }
    });

    sinon.spy(firstSc, 'update');

    firstSc.add([ monkeyX, monkeyY ]);

    game.scenes.add(firstSc);

    game.start();

    // let the game run for 50 ms
    setTimeout(function(){      
      game.end();

      expect(firstSc.update).to.have.been.called;
      expect(monkeyX.update).to.have.been.called;
      expect(monkeyY.update).to.have.been.called;

      expect(monkeyX.position.x).to.be.greaterThan(0);
      expect(monkeyX.position.y).to.be.equal(0);

      expect(monkeyY.position.x).to.be.equal(0);
      expect(monkeyY.position.y).to.be.greaterThan(0);

      firstSc.update.restore();
      monkeyX.update.restore();
      monkeyY.update.restore();

      done();

    }, 50);

  });

});