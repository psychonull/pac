
var Point = require('../../../../src/Point');
var GameObject = require('../../../../src/GameObject');
var Delay = require('../../../../src/actions/Delay');
var Action = require('../../../../src/Action');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestObj = GameObject.extend();

var fakeGame = {
  inputs: {
    cursor: {
      position: new Point()
    }
  }
};

describe('Delay', function(){

  it('must block the action list for a duration', function(){
    var FinishAction = Action.extend({
      onStart: function() { },
      update: function() { }
    });

    var delay = new Delay(0.5);
    var finish = new FinishAction();

    sinon.spy(finish, 'onStart');

    var obj = new TestObj({
      actions: [ delay, finish ]
    });

    expect(delay.isBlocking).to.be.true;

    var dt = 0.1;
    for (var i=0; i<5; i++){
      obj.updateActions(dt);
      expect(finish.onStart).to.not.have.been.called;
    }

    obj.updateActions(dt);

    // elapsed = 0.6
    expect(finish.onStart).to.have.been.called;
  });

});