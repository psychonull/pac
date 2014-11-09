
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Circle = require('../../../../src/Circle');
var Hoverable = require('../../../../src/actions/Hoverable');

var chai = require('chai');
var expect = chai.expect;

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

var fakeGame = {
  inputs: {
    cursor: {
      position: new Point()
    }
  }
};

describe('Hoverable', function(){

  it('must throw an error if has no shape defined', function(){
    expect(function(){

      var obj = new TestObj({
        position: new Point(200, 200),
        size: { width: 100, height: 100 },
        actions: [ new Hoverable() ]
      });

      obj.game = fakeGame;
      obj.updateActions();

    }).to.throw('Hoverable Action requires a [shape] on the Object');
  });

  it('must emit an event on its owner when it is clicked', function(){
    var obj = new TestObj({
      position: new Point(200, 200),
      size: { width: 10, height: 10 },
      actions: [ new Hoverable() ],
      shape: new Rectangle({ size: { width: 100, height: 100 }})
    });

    obj.game = fakeGame;

    var emittedIn = 0;
    var emittedOut = 0;
    obj.on('hover:in', function(){
      emittedIn++;
    });

    obj.on('hover:out', function(){
      emittedOut++;
    });

    obj.updateActions();
    expect(emittedIn).to.be.equal(0);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.false;

    // Hover inside
    fakeGame.inputs.cursor.position = new Point(250, 250);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.true;

    // Hover inside moving
    fakeGame.inputs.cursor.position = new Point(280, 280);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.true;

    // Hover outside
    fakeGame.inputs.cursor.position = new Point(310, 310);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(1);
    expect(obj.isHover).to.be.false;

    // Hover outside moving
    fakeGame.inputs.cursor.position = new Point(320, 320);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(1);
    expect(obj.isHover).to.be.false;

  });

  it('must emit an event on its owner when it is clicked (circle)', function(){
    var obj = new TestObj({
      position: new Point(200, 200),
      size: { width: 10, height: 10 },
      actions: [ new Hoverable() ],
      shape: new Circle({ radius: 100 })
    });

    obj.game = fakeGame;

    var emittedIn = 0;
    var emittedOut = 0;
    obj.on('hover:in', function(){
      emittedIn++;
    });

    obj.on('hover:out', function(){
      emittedOut++;
    });

    obj.updateActions();
    expect(emittedIn).to.be.equal(0);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.false;

    // Hover inside
    fakeGame.inputs.cursor.position = new Point(250, 250);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.true;

    // Hover inside moving
    fakeGame.inputs.cursor.position = new Point(260, 260);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(0);
    expect(obj.isHover).to.be.true;

    // Hover outside
    fakeGame.inputs.cursor.position = new Point(310, 310);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(1);
    expect(obj.isHover).to.be.false;

    // Hover outside moving
    fakeGame.inputs.cursor.position = new Point(320, 320);

    obj.updateActions();
    expect(emittedIn).to.be.equal(1);
    expect(emittedOut).to.be.equal(1);
    expect(obj.isHover).to.be.false;

  });

});