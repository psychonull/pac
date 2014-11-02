
var List = require('../../../../src/List');
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var expect = require('chai').expect;

describe('ActionList', function(){

  it('must be inherit from a List and have Action as childs', function(){
    expect(ActionList.prototype).to.be.an.instanceof(List);
    
    var list = new ActionList();
    expect(list.childType).to.be.equal(Action);
  });

  require('./constructor');
  require('./methods');

  require('./fullUpdate');
  
});
