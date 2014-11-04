
var MapList = require('../../../../src/MapList');
var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var expect = require('chai').expect;

describe('Animations', function(){

  it('must be inherit from a MapList and have Animation as childs', function(){
    expect(AnimationList.prototype).to.be.an.instanceof(MapList);
    
    var list = new AnimationList();
    expect(list.length).to.be.equal(0);
    expect(list.childType).to.be.equal(Animation);
  });

  require('./constructor');
  require('./methods');

});
