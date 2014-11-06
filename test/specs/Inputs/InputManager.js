
var pac = require('../../../src/pac');
var InputManager = require('../../../src/InputManager');

var MapList = require('../../../src/MapList');
var Input = require('../../../src/Input');
var MouseInput = require('../../../src/MouseInput');

var Point = require('../../../src/Point');

var chai = require('chai');
var expect = chai.expect;

describe('InputManager', function(){

  it('must NOT expose Input Class', function(){
    expect(pac.InputManager).to.be.undefined;
  });

  it('must be a MapList with Input as childType', function(){
    expect(InputManager.prototype).to.be.instanceof(MapList);

    var manager = new InputManager();
    expect(manager.childType).to.be.equal(Input);

    expect(manager.update).to.be.a('function');
  });

  describe('#Create', function(){

    it('must expose a static create function', function(){
      expect(InputManager.create).to.be.a('function');

      var manager = InputManager.create();
      expect(manager).to.be.instanceof(InputManager);
    });

    it('must support MouseInput type', function(){
      var canvas = document.createElement('canvas');

      var manager = InputManager.create(MouseInput, {
        container: canvas,
        enabled: true
      });

      var mouse = manager.get('mouse');
      expect(mouse).to.be.instanceof(MouseInput);
      expect(mouse.container).to.be.equal(canvas);
      expect(mouse.enabled).to.be.equal(true);
    });

    it('must support KeyboardInput type');

    it('must set the state of inputs when they happen', function(){
      var canvas = document.createElement('canvas');

      //TODO: add more inputs to test all together

      var manager = InputManager.create(MouseInput, {
        container: canvas,
        enabled: true
      });

      var cursor = manager.cursor;
      expect(cursor).to.be.a('object');
      expect(cursor.position.x).to.be.equal(0);
      expect(cursor.position.y).to.be.equal(0);

      expect(cursor.isDown).to.be.false;

      expect(cursor.position.x).to.be.equal(0);
      expect(cursor.position.y).to.be.equal(0);

      var mouse = manager.get('mouse');

      var pos = new Point(10, 10);
      mouse.emit(Input.events.MOVE, pos);
      expect(cursor.position.x).to.be.equal(pos.x);
      expect(cursor.position.y).to.be.equal(pos.y);

      expect(cursor.isDown).to.be.false;

      mouse.emit(Input.events.DOWN);
      expect(cursor.isDown).to.be.false;

      manager.update();
      expect(cursor.isDown).to.be.true;

      manager.update();
      expect(cursor.isDown).to.be.true;

      mouse.emit(Input.events.UP);
      expect(cursor.isDown).to.be.true;

      manager.update();
      expect(cursor.isDown).to.be.false;
    });

  });


});
