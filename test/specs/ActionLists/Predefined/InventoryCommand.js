
var BaseCommand = require('../../../../src/actions/BaseCommand');
var InventoryCommand = require('../../../../src/actions/InventoryCommand');
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

var walkablearea = {
  name: 'WalkableArea',
  moveWalkersToObject: function(){}
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

describe('InventoryCommand', function(){

  it('must inherit from a BaseCommand', function(){
    expect(InventoryCommand.prototype).to.be.an.instanceof(BaseCommand);
  });

  describe('constructor', function(){

    it('must allow to be created', function(){
      var cmdAction = new InventoryCommand('use');
      expect(cmdAction.isBlocking).to.be.true;
      expect(cmdAction.command).to.be.equal('use');

      cmdAction = new InventoryCommand({
        command: 'use'
      });

      expect(cmdAction.command).to.be.equal('use');
    });

  });

  describe('update', function(){

    it('must update the commandbar and inventory and finalize the action',
      function(){

      sinon.spy(commandbar, 'showHoverMessage');

      var obj = new TestObj({
        name: 'test object',
        shape: true,
        actions: [ new InventoryCommand('give') ],
      });

      var giveCalled = 0;
      obj.onCommand = {
        give: function(){
          giveCalled++;
        }
      };

      commandbar.inventory.current = null;
      obj.game = fakeGame;
      obj.isInInventory = true;

      obj.updateActions(dt);

      expect(commandbar.showHoverMessage).to.have.been.calledWith(obj);
      expect(commandbar.inventory.current).to.be.equal('test object');

      expect(obj.actions.length).to.be.equal(0);
      expect(giveCalled).to.be.equal(0);

      commandbar.showHoverMessage.restore();
    });

    it('must create a Command for the action and finalize itself', function(){

      var obj = new TestObj({
        name: 'test object',
        shape: true,
        actions: [ new InventoryCommand('use') ],
      });

      var useCalled = 0;
      obj.onCommand = {
        use: function(){
          useCalled++;
        }
      };

      obj.game = fakeGame;
      obj.isInInventory = true;

      commandbar.inventory.current = null;

      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(Command)).to.be.tue;
      expect(useCalled).to.be.equal(0);

      obj.updateActions(dt);
      expect(useCalled).to.be.equal(1);
      expect(obj.actions.length).to.be.equal(0);
    });

    it('must create a Command for the action without replacing the curent',
      function(){

      var obj = new TestObj({
        name: 'other test object',
        shape: true,
        actions: [ new InventoryCommand('give') ],
      });

      var giveCalled = 0;
      obj.onCommand = {
        give: function(objName){
          expect(objName).to.be.equal('test object');
          giveCalled++;
        }
      };

      obj.game = fakeGame;
      obj.isInInventory = true;

      commandbar.inventory.current = 'test object';

      obj.updateActions(dt);

      expect(commandbar.inventory.current).to.be.equal('test object');

      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.has(Command)).to.be.true;
      expect(giveCalled).to.be.equal(0);

      obj.updateActions(dt);
      expect(giveCalled).to.be.equal(1);
      expect(obj.actions.length).to.be.equal(0);
    });

  });

});

