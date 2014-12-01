
var Stage = require('../../../src/Stage');
var Layer = require('../../../src/Layer');
var MapList = require('../../../src/MapList');
var GameObject = require('../../../src/GameObject');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init a MapList object with a "default" Layer', function(){
    expect(Stage.prototype).to.be.an.instanceof(MapList);

    var stage = new Stage();
    expect(stage.childType).to.be.equal(Layer);
    expect(stage.length).to.be.equal(1);

    var defaultLayer = stage.get('default');
    expect(defaultLayer).to.be.an.instanceof(Layer);
    expect(defaultLayer.childType).to.be.equal(GameObject);
  });

});

describe('Stage.create', function(){

  it('should init an Stage with an array of Layers', function(){
    expect(Stage.create).to.be.a('function');

    var stage = Stage.create([ 'background', 'front' ]);

    expect(stage.length).to.be.equal(3);

    expect(stage.layers).to.be.an('array');
    expect(stage.layers[0]).to.be.equal('background');
    expect(stage.layers[1]).to.be.equal('front');
    expect(stage.layers[2]).to.be.equal('default');

    var bgLayer = stage.get('background');
    expect(bgLayer).to.be.an.instanceof(Layer);

    var frontLayer = stage.get('front');
    expect(frontLayer).to.be.an.instanceof(Layer);

    var defaultLayer = stage.get('default');
    expect(defaultLayer).to.be.an.instanceof(Layer);
  });

});