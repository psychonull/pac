
var Stage = require('../../../../../src/Stage');
var Layer = require('../../../../../src/Layer');
var MapList = require('../../../../../src/MapList');
var Drawable = require('../../../../../src/Drawable');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init a MapList object with a "default" Layer', function(){
    expect(Stage.prototype).to.be.an.instanceof(MapList);

    var stage = new Stage();
    expect(stage.childType).to.be.equal(Layer);
    expect(stage.length).to.be.equal(1);

    var defaultLayer = stage.get('default');
    expect(defaultLayer).to.be.an.instanceof(Layer);
    expect(defaultLayer.childType).to.be.equal(Drawable);
  });

});