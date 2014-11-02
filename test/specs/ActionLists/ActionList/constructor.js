
var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestAction1 = Action.extend({
  update: function() {}
});

var TestAction2 = Action.extend({
  update: function() {}
});

describe('Constructor', function(){

  it('must allow to create an empty action list', function(){
    var list = new ActionList();
    expect(list.length).to.be.equal(0);
  });

  it('must allow to create an action list with a list', function(){
    var list = new ActionList([ new TestAction1(), new TestAction2() ]);
    expect(list.length).to.be.equal(2);

    list.each(function(action){
      expect(action.actionList).to.be.equal(list);
    });
  });

});