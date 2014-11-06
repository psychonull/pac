
var pac = require('../../../src/pac');
var Point = require('../../../src/Point');
var Input = require('../../../src/Input');
var MouseInput = require('../../../src/MouseInput');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('MouseInput', function(){

  it('must expose MouseInput Class', function(){
    expect(pac.MouseInput).to.be.a('function');
  });

  describe('Constructor', function(){

    it('must init with defaults and attach events', function(){
      var canvas = document.createElement('canvas');

      sinon.spy(canvas, 'addEventListener');

      var input = new MouseInput({
        container: canvas
      });

      expect(input.container).to.be.equal(canvas);
      expect(input.enabled).to.be.equal(false);

      expect(input.events).to.be.ok;
      expect(input.events.mouseup).to.be.ok;
      expect(input.events.mousedown).to.be.ok;
      expect(input.events.mousemove).to.be.ok;

      expect(canvas.addEventListener).to.have.been.calledWith('mouseup');
      expect(canvas.addEventListener).to.have.been.calledWith('mousedown');
      expect(canvas.addEventListener).to.have.been.calledWith('mousemove');
    });

  });

  describe('Events', function(){

    it('must emit when moves', function(){
      var canvas = document.createElement('canvas');
      var input = new MouseInput({
        container: canvas,
        enabled: true
      });

      var movePos = new Point(150, 250);

      var emitted = 0;
      input.on(Input.events.MOVE, function(position){
        emitted++;

        expect(position.x).to.be.equal(movePos.x);
        expect(position.y).to.be.equal(movePos.y);
      });

      input._onmousemove({
        pageX: movePos.x,
        pageY: movePos.y
      });

      expect(emitted).to.be.equal(1);
    });

    it('must emit when action down', function(){
      var canvas = document.createElement('canvas');
      var input = new MouseInput({
        container: canvas,
        enabled: true
      });

      var movePos = new Point(150, 250);

      var emitted = 0;
      input.on(Input.events.DOWN, function(position){
        emitted++;

        expect(position.x).to.be.equal(movePos.x);
        expect(position.y).to.be.equal(movePos.y);
      });

      input._onmousedown({
        pageX: movePos.x,
        pageY: movePos.y
      });

      expect(emitted).to.be.equal(1);
    });

    it('must emit when action up', function(){
      var canvas = document.createElement('canvas');
      var input = new MouseInput({
        container: canvas,
        enabled: true
      });

      var movePos = new Point(150, 250);

      var emitted = 0;
      input.on(Input.events.UP, function(position){
        emitted++;

        expect(position.x).to.be.equal(movePos.x);
        expect(position.y).to.be.equal(movePos.y);
      });

      input._onmouseup({
        pageX: movePos.x,
        pageY: movePos.y
      });

      expect(emitted).to.be.equal(1);
    });

  });

  describe('Enable and Disable', function(){

    it('must not fire down and up events if is disable', function(){

      var canvas = document.createElement('canvas');
      var input = new MouseInput({
        container: canvas,
        enabled: true
      });

      var emittedMove = 0;
      input.on(Input.events.MOVE, function(position){
        emittedMove++;
      });

      var emittedUp = 0;
      input.on(Input.events.UP, function(position){
        emittedUp++;
      });

      var emittedDown = 0;
      input.on(Input.events.DOWN, function(position){
        emittedDown++;
      });

      var movePos = new Point(150, 250);
      var e = {
        pageX: movePos.x,
        pageY: movePos.y
      };

      input.disable();

      input._onmousemove(e);
      input._onmousedown(e);
      input._onmouseup(e);

      expect(emittedMove).to.be.equal(1);
      expect(emittedUp).to.be.equal(0);
      expect(emittedDown).to.be.equal(0);

    });

  });

});
