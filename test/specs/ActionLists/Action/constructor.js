
var Action = require('../../../../src/Action');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Constructor', function(){

  it('must allow to create an empty action with defaults', function(){
    var action = new Action();

    expect(action.requires).to.be.null;
    expect(action.isFinished).to.be.equal(false);
    expect(action.isBlocking).to.be.equal(false);
  });

});