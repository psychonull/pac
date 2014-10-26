
var pac = require('../../../../src/pac');

var chai = require('chai');
var expect = chai.expect;

var TestRenderer = pac.Renderer.extend({

  init: function(){
    TestRenderer.__super__.init.apply(this, arguments);
  },
  
  onStageAdd: function(){ },
  onStageClear: function(){ },
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
  });

  it('must have defaults', function(){
    var renderer = new TestRenderer(fakeGame);
    
    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(800);
    expect(renderer.size.height).to.be.equal(600);
    expect(renderer.backgroundColor).to.be.equal('#000000');
    expect(renderer.container).to.be.equal(document.body);

  });

  it('must allow to set options', function(){

    var dummyContainer = document.createElement('div');
    dummyContainer.id = 'dummy-ctn';

    var renderer = new TestRenderer(fakeGame, {
      size: { width: 500, height: 300 },
      backgroundColor: '#fff',
      container: dummyContainer
    });
    
    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(500);
    expect(renderer.size.height).to.be.equal(300);
    expect(renderer.backgroundColor).to.be.equal('#fff');

    expect(renderer.container).to.be.equal(dummyContainer);
    expect(renderer.container.id).to.be.equal(dummyContainer.id);
    expect(renderer.container.tagName.toLowerCase()).to.be.equal('div');
  });

});
