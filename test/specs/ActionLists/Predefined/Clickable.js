
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Circle = require('../../../../src/Circle');
var Clickable = require('../../../../src/actions/Clickable');

var chai = require('chai');
var expect = chai.expect;

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

var fakeGame = {
  inputs: {
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

  it('must emit an event on its owner when it is clicked', function(){

    var obj = new TestObj({
      position: new Point(200, 200),
      size: { width: 10, height: 10 },
      actions: [ new Clickable() ],
      shape: new Rectangle({ size: { width: 100, height: 100 }})
    });

    obj.game = fakeGame;

    function validate(){

      var emitted = 0;
      obj.on('click', function(){
        emitted++;
      });

      obj.updateActions();
      expect(emitted).to.be.equal(0);
      expect(obj.isClicked).to.be.false;

      // Click inside
      fakeGame.inputs.cursor.position = new Point(250, 250);
      fakeGame.inputs.cursor.isDown = true;

      obj.updateActions();
      expect(emitted).to.be.equal(1);
      expect(obj.isClicked).to.be.true;

      fakeGame.inputs.cursor.isDown = false;

      obj.updateActions();
      expect(emitted).to.be.equal(1);
      expect(obj.isClicked).to.be.false;

      // Click outside
      fakeGame.inputs.cursor.position = new Point(350, 350);
      fakeGame.inputs.cursor.isDown = true;

      obj.updateActions();
      expect(emitted).to.be.equal(1);
      expect(obj.isClicked).to.be.false;
    }

    validate();

    obj.shape = new Circle({ radius: 100 });
    validate();

  });

});