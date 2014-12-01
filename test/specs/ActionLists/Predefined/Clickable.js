
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Circle = require('../../../../src/Circle');
var Polygon = require('../../../../src/Polygon');
var Clickable = require('../../../../src/actions/Clickable');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

var fakeGame = {
  inputs: {
    register: function() {},
    cursor: {
      isDown: false,
      position: new Point()
    }
  }
};

describe('Clickable', function(){

  it('must throw an error if has no shape defined', function(){
    expect(function(){

      var obj = new TestObj({
        position: new Point(200, 200),
        size: { width: 100, height: 100 },
        actions: [ new Clickable() ]
      });

      obj.game = fakeGame;
      obj.updateActions();

    }).to.throw('Clickable Action requires a [shape] on the Object');
  });

  it('must emit register to inputs when is clicked', function(){

    sinon.spy(fakeGame.inputs, 'register');

    var obj = new TestObj({
      position: new Point(200, 200),
      size: { width: 10, height: 10 },
      actions: [ new Clickable() ],
      shape: new Rectangle({ size: { width: 100, height: 100 }})
    });

    obj.game = fakeGame;

    var emitted = 0;
    obj.on('click', function(){
      emitted++;
    });

    obj.isClicked = false;
    expect(emitted).to.be.equal(0);

    // Click inside
    fakeGame.inputs.cursor.position = new Point(250, 250);
    fakeGame.inputs.cursor.isDown = true;

    obj.updateActions();

    expect(fakeGame.inputs.register).to.have.been.calledWith('click', obj);

    obj.isClicked = true; // simulate a click from input manager
    fakeGame.inputs.register.reset();

    obj.updateActions();

    expect(fakeGame.inputs.register).to.not.have.been.called;
    expect(emitted).to.be.equal(1);

    emitted = 0;
    fakeGame.inputs.register.reset();
    obj.isClicked = false;

    // Click outside
    fakeGame.inputs.cursor.position = new Point(350, 350);
    fakeGame.inputs.cursor.isDown = true;

    obj.updateActions();
    expect(emitted).to.be.equal(0);
    expect(fakeGame.inputs.register).to.not.have.been.called;

    fakeGame.inputs.register.restore();
  });

  it('must NOT register to inputs when is NOT active', function(){

    sinon.spy(fakeGame.inputs, 'register');

    var obj = new TestObj({
      position: new Point(200, 200),
      size: { width: 10, height: 10 },
      actions: [ new Clickable() ],
      shape: new Rectangle({ size: { width: 100, height: 100 }})
    });

    obj.game = fakeGame;
    obj.active = false;

    var emitted = 0;
    obj.on('click', function(){
      emitted++;
    });

    obj.isClicked = false;
    expect(emitted).to.be.equal(0);

    // Click inside
    fakeGame.inputs.cursor.position = new Point(250, 250);
    fakeGame.inputs.cursor.isDown = true;

    obj.updateActions();

    expect(fakeGame.inputs.register).to.not.have.been.called;
    expect(emitted).to.be.equal(0);

    // Click outside
    fakeGame.inputs.cursor.position = new Point(350, 350);
    fakeGame.inputs.cursor.isDown = true;

    obj.updateActions();
    expect(emitted).to.be.equal(0);
    expect(fakeGame.inputs.register).to.not.have.been.called;

    fakeGame.inputs.register.restore();
  });

});