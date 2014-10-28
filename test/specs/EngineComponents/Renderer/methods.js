
var pac = require('../../../../src/pac');
var Drawable = require('../../../../src/Drawable');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestRenderer = pac.Renderer.extend({

  onStageAdd: function(){ },
  onStageClear: function(){ },
  render: function() { }

});

var TestObject = Drawable.extend();

describe('Methods', function(){

  it('must call onStageAdd method when a stage object is added', function(){

    sinon.spy(TestRenderer.prototype, 'onStageAdd');

    var renderer = new TestRenderer();
    expect(renderer.onStageAdd).to.be.a('function');

    var testObj = new TestObject();
    renderer.stage.add(testObj);

    expect(renderer.onStageAdd).to.have.been.calledOnce;
    expect(renderer.onStageAdd).to.have.been.calledWith(testObj);

    TestRenderer.prototype.onStageAdd.restore();
  });

  it('must call onStageClear method when the stage is cleared', function(){

    sinon.spy(TestRenderer.prototype, 'onStageClear');

    var renderer = new TestRenderer();
    expect(renderer.onStageClear).to.be.a('function');

    renderer.stage.clear();

    expect(renderer.onStageClear).to.have.been.calledOnce;

    TestRenderer.prototype.onStageClear.restore();
  });

  it('must expose a render method', function(){
    var renderer = new TestRenderer();
    expect(renderer.render).to.be.a('function');
  });


  it('must throw an error for required overrides', function(){
    var testInstance;

    var TestRenderer = pac.Renderer.extend();

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.onStageAdd();
    }).to.throw('Must override renderer.onStageAdd()');

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.onStageClear();
    }).to.throw('Must override renderer.onStageClear()');

    expect(function(){
      testInstance = new TestRenderer();
      testInstance.render();
    }).to.throw('Must override renderer.render()');

  });

});
