
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

describe('Constructor', function(){

  it('must have an stage upon initialization', function(){
    var renderer = new TestRenderer();
    expect(renderer.stage).to.be.an.instanceof(pac.Stage);
  });

  it('must have defaults', function(){
    var renderer = new TestRenderer();
    
    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(800);
    expect(renderer.size.height).to.be.equal(600);
    expect(renderer.backgroundColor).to.be.equal('#000');
  });

  it('must allow to set options', function(){
    var renderer = new TestRenderer({
      size: { width: 500, height: 300 },
      backgroundColor: '#fff'
    });
    
    expect(renderer.size).to.be.an('object');
    expect(renderer.size.width).to.be.equal(500);
    expect(renderer.size.height).to.be.equal(300);
    expect(renderer.backgroundColor).to.be.equal('#fff');
  });

});
