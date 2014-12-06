
var pac = require('../../../src/pac');
var Input = require('../../../src/Input');
var KeyboardInput = require('../../../src/KeyboardInput');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('KeyboardInput', function(){
  var canvas;

  beforeEach(function(){
    canvas = document.createElement('canvas');

  });

  it('must expose KeyboardInput Class', function(){
    expect(pac.KeyboardInput).to.be.a('function');
  });

  describe('Constructor', function(){

    it('must init with defaults and attach events', function(){

      sinon.spy(window.document, 'addEventListener');
      sinon.spy(KeyboardInput.prototype, '_initKeys');

      var keys = ['A', 'S', 'D'];

      var input = new KeyboardInput({
        container: canvas,
        keys: keys
      });

      expect(input.container).to.be.equal(canvas);
      expect(input.enabled).to.be.equal(false);
      expect(input.scale).to.be.equal(1);

      expect(input.events).to.be.ok;
      expect(input.events.keyup).to.be.ok;
      expect(input.events.keydown).to.be.ok;

      expect(window.document.addEventListener).to.have.been
        .calledWith('keyup');
      expect(window.document.addEventListener).to.have.been
        .calledWith('keydown');

      expect(input._initKeys).to.have.been.calledWith(keys);
      KeyboardInput.prototype._initKeys.restore();

    });

  });

  describe('Methods', function(){

    describe('_onkeydown and _onkeyup', function(){

      it('must emit the events', function(){
        var input = new KeyboardInput({
          container: canvas,
          enabled: true
        });

        sinon.stub(input, 'emit');

        input._onkeydown({
          keyCode: 70
        });

        input._onkeyup({
          keyCode: 70
        });

        expect(input.emit).to.have.been.calledWith(Input.events.KEYDOWN);
        expect(input.emit).to.have.been.calledWith(Input.events.KEYUP);
      });

      it('must not emit if keyCode not in the keys', function(){
        var input = new KeyboardInput({
          container: canvas,
          enabled: true,
          keys: ['UP']
        });

        sinon.stub(input, 'emit');

        input._onkeydown({
          keyCode: 70
        });

        input._onkeyup({
          keyCode: 70
        });

        expect(input.emit).to.not.have.been.called;
      });

      it('must emit with key and original event object', function(){
        var input = new KeyboardInput({
          container: canvas,
          enabled: true
        });

        var fakeEventObject = {
          keyCode: 65
        };

        sinon.stub(input, 'emit');

        input._onkeydown(fakeEventObject);

        input._onkeyup(fakeEventObject);

        expect(input.emit).to.have.been
          .calledWith(Input.events.KEYDOWN, 'A', fakeEventObject);
        expect(input.emit).to.have.been
          .calledWith(Input.events.KEYUP, 'A', fakeEventObject);
      });

      it('must update if the key isDown accordingly', function(){
        var input = new KeyboardInput({
          container: canvas,
          enabled: true
        });

        var fakeEventObject = {
          keyCode: 65
        };

        sinon.stub(input, 'emit');

        expect(input.keys.A.isDown).to.be.false;

        input._onkeydown(fakeEventObject);

        expect(input.keys.A.isDown).to.be.true;

        input._onkeyup(fakeEventObject);

        expect(input.keys.A.isDown).to.be.false;
      });

    });

    describe('_initKeys', function(){

      it('should add every key if no array is passed, or only the ones passed',
        function(){

          var input = new KeyboardInput({
            container: canvas,
            enabled: true
          });

          expect(input.keys).to.be.ok;
          expect(input.keys.A).to.be.an.object;
          expect(input.keys.A.isDown).to.be.false;

          input._initKeys(['up']);

          expect(input.keys.A).to.be.undefined;
          expect(input.keys.UP.isDown).to.be.false;

        }
      );
    });

  });

  describe('Enable and Disable', function(){

    it('must not fire down and up events if is disabled', function(){
      var input = new KeyboardInput({
        container: canvas,
        enabled: false
      });

      sinon.stub(input, 'emit');

      input._onkeydown({
        keyCode: 70
      });

      input._onkeyup({
        keyCode: 70
      });

      expect(input.emit).to.not.have.been.called;

    });

  });

});
