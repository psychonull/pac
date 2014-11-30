
var BaseCommand = require('../../../../src/actions/BaseCommand');
var WalkerCommand = require('../../../../src/actions/WalkerCommand');
var Commander = require('../../../../src/actions/Commander');
var Command = require('../../../../src/actions/Command');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var dt = 0.16;

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestObj = Sprite.extend({
  texture: 'testTexture',
  size: { width: 50, height: 50 }
});

var commandbar = {
  name: 'CommandBar',
  showHoverMessage: function() {},
  hideHoverMessage: function() {},
  showCannotMessage: function() {},
  resetCommand: function() {},
  inventoryCommands: { 'give': 'to '},
  inventory: {
    current: null
  }
};

var testWalker = {
  name: 'Walker',
  walkingTo: null,
  targetReached: false
};

var walkablearea = {
  name: 'WalkableArea',
  moveWalkersToObject: function(){},
  getWalker: function(){
    return testWalker;
  }
};

var fakeGame = {
  inputs: { cursor: { isDown: false, position: new Point() } },
  findOne: function(name){
    switch(name){
      case 'CommandBar': return commandbar;
      case 'WalkableArea': return walkablearea;
    }
  }
};

describe('WalkerCommand', function(){

  it('must inherit from a BaseCommand', function(){
    expect(WalkerCommand.prototype).to.be.an.instanceof(BaseCommand);
  });

  describe('constructor', function(){

    it('must allow to be created', function(){
      var cmdAction = new WalkerCommand('use');
      expect(cmdAction.isBlocking).to.be.true;
      expect(cmdAction.command).to.be.equal('use');

      cmdAction = new WalkerCommand({
        command: 'use'
      });

      expect(cmdAction.command).to.be.equal('use');
    });

  });

  describe('onStart', function(){

    it('must init the action with a walker', function(){

      var cmdAction = new WalkerCommand('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      obj.game = fakeGame;

      cmdAction.onStart();

      expect(obj.actions.length).to.be.equal(1);
      expect(cmdAction.commandBar.name).to.be.equal('CommandBar');
      expect(cmdAction.walkableArea.name).to.be.equal('WalkableArea');
      expect(cmdAction.walker.name).to.be.equal('Walker');

    });

  });

  describe('update', function(){

    it('must create a command and finalize when the walker reached the target',
      function(){

      var obj = new TestObj({
        name: 'test object',
        shape: true,
        actions: [ new WalkerCommand('give') ],
      });

      var giveCalled = 0;
      obj.onCommand = {
        give: function(){
          giveCalled++;
        }
      };

      obj.game = fakeGame;
      testWalker.walkingTo = new Point(1, 5);
      testWalker.targetReached = false;

      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(WalkerCommand)).to.be.true;
      expect(giveCalled).to.be.equal(0);

      testWalker.walkingTo = null;
      testWalker.targetReached = true;
      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(Command)).to.be.true;
      expect(giveCalled).to.be.equal(0);

      obj.updateActions(dt);

      expect(giveCalled).to.be.equal(1);
      expect(obj.actions.length).to.be.equal(0);
    });

    it('must NOT create a command and finalize when the walker stop',
      function(){

      var obj = new TestObj({
        name: 'test object',
        shape: true,
        actions: [ new WalkerCommand('give') ],
      });

      var giveCalled = 0;
      obj.onCommand = {
        give: function(){
          giveCalled++;
        }
      };

      obj.game = fakeGame;

      testWalker.walkingTo = new Point(1, 5);
      testWalker.targetReached = false;

      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(WalkerCommand)).to.be.true;
      expect(giveCalled).to.be.equal(0);

      testWalker.walkingTo = null;
      testWalker.targetReached = false;
      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(0);
      expect(obj.actions.has(Command)).to.be.false;
      expect(giveCalled).to.be.equal(0);

    });

    it('must create a command and finalize when the walker starts as reached',
      function(){

      var obj = new TestObj({
        name: 'test object',
        shape: true,
        actions: [ new WalkerCommand('give') ],
      });

      var giveCalled = 0;
      obj.onCommand = {
        give: function(){
          giveCalled++;
        }
      };

      obj.game = fakeGame;

      testWalker.walkingTo = null;
      testWalker.targetReached = true;

      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(Command)).to.be.true;
      expect(giveCalled).to.be.equal(0);

      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(0);
      expect(obj.actions.has(Command)).to.be.false;
      expect(giveCalled).to.be.equal(1);
    });

  });

});

