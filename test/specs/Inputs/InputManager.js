
var pac = require('../../../src/pac');
var InputManager = require('../../../src/InputManager');

var MapList = require('../../../src/MapList');
var Input = require('../../../src/Input');
var MouseInput = require('../../../src/MouseInput');
var KeyboardInput = require('../../../src/KeyboardInput');

var Stage = require('../../../src/Stage');
var Sprite = require('../../../src/Sprite');
var Point = require('../../../src/Point');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

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

    it('must support KeyboardInput type', function(){
      var canvas = document.createElement('canvas');

      var manager = InputManager.create(KeyboardInput, {
        container: canvas,
        enabled: true
      });

      var keyboard = manager.get('keyboard');
      expect(keyboard).to.be.instanceof(KeyboardInput);
      expect(keyboard.container).to.be.equal(canvas);
      expect(keyboard.enabled).to.be.equal(true);
    });

    it('must set the state of inputs when they happen', function(){

      //TODO: add more inputs to test all together

      var manager = InputManager.create(MouseInput, {
        container: document.createElement('canvas'),
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
      expect(cursor.isDown).to.be.false;

      mouse.emit(Input.events.UP);
      expect(cursor.isDown).to.be.false;

      manager.update();
      expect(cursor.isDown).to.be.false;

      mouse.emit(Input.events.DOWN);
      expect(cursor.isDown).to.be.false;

      manager.update();
      expect(cursor.isDown).to.be.true;

      manager.update();
      expect(cursor.isDown).to.be.false;

    });

  });

  describe('Enable & Disable', function(){

    it('must allow to enable and disable inputs', function(){

      var manager = InputManager.create(MouseInput, {
        container: document.createElement('canvas')
      });

      expect(manager.enable).to.be.a('function');
      expect(manager.disable).to.be.a('function');

      var mouse = manager.get('mouse');
      sinon.spy(mouse, 'enable');
      sinon.spy(mouse, 'disable');

      manager.enable();
      expect(mouse.enable).to.have.been.called;

      manager.disable();
      expect(mouse.disable).to.have.been.called;
    });

  });

  describe('Stages', function(){

    it('must support layers on creation', function(){

      var manager = InputManager.create(MouseInput, {
        container: document.createElement('canvas'),
        enabled: true,
        layers: [ 'background', 'front' ]
      });

      expect(manager.clickStage).to.be.instanceof(Stage);
      expect(manager.hoverStage).to.be.instanceof(Stage);
    });

    describe('register', function(){

      var manager;

      var objBg1;
      var objBg2;
      var objFr1;
      var objFr2;

      before(function(){

        manager = InputManager.create(MouseInput, {
          container: document.createElement('canvas'),
          enabled: true,
          layers: [ 'background', 'front' ]
        });

        var TestObj = Sprite.extend({
          texture: 'testTexture'
        });

        objBg1 = new TestObj({ layer: 'background', zIndex: 1 });
        objBg2 = new TestObj({ layer: 'background', zIndex: 2 });
        objFr1 = new TestObj({ layer: 'front', zIndex: 1 });
        objFr2 = new TestObj({ layer: 'front', zIndex: 2 });

      });

      it('must register an object for click', function(){
        expect(manager.register).to.be.a('function');

        sinon.spy(manager.clickStage, 'addObjects');
        sinon.spy(manager.hoverStage, 'addObjects');

        var clickObjects = [objBg1, objBg2, objFr1, objFr2];
        var hoverObjects = [objBg1, objBg2, objFr1, objFr2];

        manager.register('click', clickObjects);

        expect(manager.clickStage.addObjects)
          .to.have.been.calledWith(clickObjects);
        expect(manager.hoverStage.addObjects).to.not.have.been.called;

        manager.clickStage.addObjects.reset();

        manager.register('hover', hoverObjects);

        expect(manager.hoverStage.addObjects)
          .to.have.been.calledWith(hoverObjects);
        expect(manager.clickStage.addObjects).to.not.have.been.called;

        manager.clickStage.addObjects.restore();
        manager.hoverStage.addObjects.restore();
      });

      it('must set isClicked for registered objects', function(){
        var dt = 0.16;

        sinon.spy(manager.clickStage, 'clearLayer');

        var clickObjects = [objFr1, objBg1, objFr2, objBg2];

        manager._down = false;
        manager.update(dt);

        manager.clickStage.clearLayer.reset();

        manager._down = true;
        manager.update(dt);

        manager.clickStage.clearLayer.reset();

        manager.register('click', clickObjects);
        expect(manager.clickStage.getFrontObject()).to.be.equal(objFr2);

        manager.update(dt);

        manager.clickStage.clearLayer.reset();

        expect(objBg1.isClicked).to.be.undefined;
        expect(objBg2.isClicked).to.be.undefined;
        expect(objFr1.isClicked).to.be.undefined;
        expect(objFr2.isClicked).to.be.true;

        manager.update(dt);

        expect(manager.clickStage.clearLayer).to.have.been.called;

        expect(objBg1.isClicked).to.be.undefined;
        expect(objBg2.isClicked).to.be.undefined;
        expect(objFr1.isClicked).to.be.undefined;
        expect(objFr2.isClicked).to.be.false;

        manager.clickStage.clearLayer.restore();

      });

      it('must set deadClick if no objct was registered', function(){
        var dt = 0.16;

        manager._down = false;
        manager.update(dt);

        manager._down = true;
        manager.update(dt);

        expect(manager.deadClick).to.be.false;

        manager.update(dt);

        expect(manager.deadClick).to.be.true;

        manager._down = false;
        manager.update(dt);

        expect(manager.deadClick).to.be.false;
      });

      it('must set isHover for registered objects');

    });
  });

});
