
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestRenderer = pac.Renderer.extend({

  onLayerFill: function(){ },
  onLayerClear: function(){ },
  render: function() { }

});

var TestObject = GameObject.extend();

describe('Methods', function(){

  it('must call onLayerFill method when a stage object is added', function(){

    sinon.spy(TestRenderer.prototype, 'onLayerFill');

    var renderer = new TestRenderer();
    expect(renderer.onLayerFill).to.be.a('function');

    var testObj = new TestObject();
    renderer.stage.addObjects(testObj);

    expect(renderer.onLayerFill).to.not.have.been.called;

    renderer.stage.ready();

    expect(renderer.onLayerFill).to.have.been.calledOnce;
    expect(renderer.onLayerFill).to.have.been.calledWith('default');

    TestRenderer.prototype.onLayerFill.restore();
  });

  it('must call onLayerClear method when the stage is cleared', function(){

    sinon.spy(TestRenderer.prototype, 'onLayerClear');

    var renderer = new TestRenderer();
    expect(renderer.onLayerClear).to.be.a('function');

    renderer.stage.addObjects(new TestObject());

    renderer.stage.clearLayer();

    expect(renderer.onLayerClear).to.have.been.calledOnce;
    expect(renderer.onLayerClear).to.have.been.calledWith('default');

    TestRenderer.prototype.onLayerClear.restore();
  });

  it('must expose a render method', function(){
    var renderer = new TestRenderer();
    expect(renderer.render).to.be.a('function');
  });

  it('must expose a clearBackTexture', function(){
    var renderer = new TestRenderer();
    expect(renderer.clearBackTexture).to.be.a('function');
  });

  it('must expose a setBackTexture', function(){
    var renderer = new TestRenderer();
    expect(renderer.setBackTexture).to.be.a('function');
  });

  it('must throw an error for required overrides', function(){
    var testInstance;

    var TestRenderer = pac.Renderer.extend();

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.onLayerFill();
    }).to.throw('Must override renderer.onLayerFill()');

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.onLayerClear();
    }).to.throw('Must override renderer.onLayerClear()');

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.render();
    }).to.throw('Must override renderer.render()');

  });

});
