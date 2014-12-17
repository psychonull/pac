
var MapList = require('../../../../src/MapList');
var ActionLanes = require('../../../../src/ActionLanes');
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var expect = require('chai').expect;

describe('ActionLanes', function(){

  it('must be inherit from a MapList and have ActionList as childs', function(){
    expect(ActionLanes.prototype).to.be.an.instanceof(MapList);

    var list = new ActionLanes();
    expect(list.childType).to.be.equal(ActionList);
  });

  require('./constructor');
  require('./methods');

});
