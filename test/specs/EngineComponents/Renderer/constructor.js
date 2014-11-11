
var pac = require('../../../../src/pac');

var Layer = require('../../../../src/Layer');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestRenderer = pac.Renderer.extend({

  onLayerFill: function(layer){ },
  onLayerClear: function(layer){ },
  render: function(){ },

});

var fakeGame = {};

describe('Constructor', function(){

  it('must set the game instance', function(){
    var renderer = new TestRenderer(fakeGame);
    expect(renderer.game).to.equal(fakeGame);
  });

  it('must have an stage upon initialization', function(){
    var renderer = new TestRenderer(fakeGame);
    expect(renderer.stage).to.be.an.instanceof(pac.Stage);
    expect(renderer.stage.length).to.be.equal(1); // default layer
  });

  it('must have defaults', function(){
    var renderer = new TestRenderer(fakeGame);

    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(800);
    expect(renderer.size.height).to.be.equal(600);
    expect(renderer.backgroundColor).to.be.equal('#000000');
    expect(renderer.container).to.be.equal(document.body);
    expect(renderer.scale).to.be.equal(1);

  });

  it('must allow to set options', function(){

    var dummyContainer = document.createElement('div');
    dummyContainer.id = 'dummy-ctn';

    var renderer = new TestRenderer(fakeGame, {
      size: { width: 500, height: 300 },
      backgroundColor: '#fff',
      container: dummyContainer,
      scale: 2
    });

    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(500);
    expect(renderer.size.height).to.be.equal(300);
    expect(renderer.backgroundColor).to.be.equal('#fff');

    expect(renderer.container).to.be.equal(dummyContainer);
    expect(renderer.container.id).to.be.equal(dummyContainer.id);
    expect(renderer.container.tagName.toLowerCase()).to.be.equal('div');
    expect(renderer.scale).to.be.equal(2);
  });

  it('must allow to set layers as an option', function(){

    var renderer = new TestRenderer(fakeGame, {
      layers: [ 'layer1', 'layer2', 'layer3' ]
    });

    expect(renderer.stage.length).to.be.equal(4); //plus 'default' layer

    expect(renderer.stage.get('layer1')).to.be.instanceof(Layer);
    expect(renderer.stage.get('layer2')).to.be.instanceof(Layer);
    expect(renderer.stage.get('layer3')).to.be.instanceof(Layer);
  });

  it('must subscribe to game loader complete if available', function(){
    var fakeGameWithLoader = {
      loader: {
        on: sinon.stub()
      }
    };

    var renderer = new TestRenderer(fakeGameWithLoader);

    expect(fakeGameWithLoader.loader.on).to.have.been.calledWith(
      'complete'
    );
  });



});
