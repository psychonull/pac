
var pac = require('../../../src/pac');
var Input = require('../../../src/Input');

var chai = require('chai');
var expect = chai.expect;

var TestInput = Input.extend({

});

describe('Input', function(){

  it('must expose Input Class', function(){
    expect(pac.Input).to.be.a('function');
  });

  describe('Constructor', function(){

    it('must init with defaults', function(){
      var input = new TestInput();
      expect(input.container).to.be.equal(window.document);
      expect(input.scale).to.be.equal(1);
    });

    it('must allow to set a container', function(){
      var canvas = document.createElement('canvas');

      var input = new TestInput({
        container: canvas,
        scale: 2
      });

      expect(input.container).to.be.equal(canvas);
      expect(input.scale).to.be.equal(2);
    });

    it('must have an enum of event names', function(){
      var input = new TestInput();
      expect(input.container).to.be.equal(window.document);

      expect(Input.events).to.be.a('object');
      expect(Input.events.MOVE).to.be.equal('cursor:move');
      expect(Input.events.DOWN).to.be.equal('cursor:down');
      expect(Input.events.UP).to.be.equal('cursor:up');
      expect(Input.events.KEYDOWN).to.be.equal('key:down');
      expect(Input.events.KEYUP).to.be.equal('key:up');
    });

  });

  describe('Methods', function(){

    it('must allow to enable and disable the Input', function(){
      var input = new TestInput();
      expect(input.enabled).to.be.false;

      input.enable();
      expect(input.enabled).to.be.true;

      input.disable();
      expect(input.enabled).to.be.false;

      input = new TestInput({
        enabled: true
      });

      expect(input.enabled).to.be.true;
    });

  });

});
