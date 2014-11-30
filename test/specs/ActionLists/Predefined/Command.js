
var BaseCommand = require('../../../../src/actions/BaseCommand');
var Command = require('../../../../src/actions/Command');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var WalkableArea = require('../../../../src/prefabs/WalkableArea');
var Rectangle = require('../../../../src/Rectangle');

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
  resetCommand: function() {}
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

describe('Command', function(){

  it('must inherit from a BaseCommand', function(){
    expect(Command.prototype).to.be.an.instanceof(BaseCommand);
  });

  describe('constructor', function(){

    it('must allow to be created', function(){
      var cmdAction = new Command('use');
      expect(cmdAction.isBlocking).to.be.true;
      expect(cmdAction.command).to.be.equal('use');

      cmdAction = new Command({
        command: 'use'
      });

      expect(cmdAction.command).to.be.equal('use');
    });

    it('must throw an error if no Command is specify', function(){

      expect(function(){
        var cmdAction = new Command();
      }).to.throw('Command Action: Expected a command');

      expect(function(){
        var cmdAction = new Command({
          test: true
        });
      }).to.throw('Command Action: Expected a command');

    });

  });

  describe('onStart', function(){

    it('must init the action', function(){

      var cmdAction = new Command('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      obj.game = fakeGame;

      cmdAction.onStart();

      expect(obj.actions.length).to.be.equal(1);
      expect(cmdAction.commandBar.name).to.be.equal('CommandBar');
      expect(cmdAction.walkableArea.name).to.be.equal('WalkableArea');

    });

  });

  describe('update', function(){

    it('must run the command and finalize the action', function(){
      sinon.spy(commandbar, 'resetCommand');

      var cmdAction = new Command('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      var useCalled = 0;
      obj.onCommand = {
        use: function(){
          useCalled++;
        }
      };

      obj.game = fakeGame;

      obj.updateActions(dt);

      expect(commandbar.resetCommand).to.have.been.called;

      expect(obj.actions.length).to.be.equal(0);
      expect(useCalled).to.be.equal(1);
      commandbar.resetCommand.restore();
    });

    it('must call cannot of commandbar and finalize the action', function(){

      sinon.spy(commandbar, 'showCannotMessage');
      sinon.spy(commandbar, 'resetCommand');

      var cmdAction = new Command('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      obj.game = fakeGame;
      obj.updateActions(dt);

      expect(commandbar.showCannotMessage).to.have.been.calledWith(obj);
      expect(commandbar.resetCommand).to.have.been.called;

      expect(obj.actions.length).to.be.equal(0);

      commandbar.showCannotMessage.restore();
      commandbar.resetCommand.restore();
    });

    it('must call cannot of commandbar with a message and finalize the action',
      function(){

      sinon.spy(commandbar, 'showCannotMessage');
      sinon.spy(commandbar, 'resetCommand');

      var cmdAction = new Command('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      var useCalled = 0;
      obj.onCommand = {
        use: function(){
          useCalled++;
          return 'cannot do that awesome command';
        }
      };

      obj.game = fakeGame;
      obj.updateActions(dt);

      expect(commandbar.showCannotMessage)
        .to.have.been.calledWith(obj, 'cannot do that awesome command');
      expect(commandbar.resetCommand).to.have.been.called;

      expect(obj.actions.length).to.be.equal(0);
      expect(useCalled).to.be.equal(1);
      commandbar.showCannotMessage.restore();
      commandbar.resetCommand.restore();
    });

    it('must NOT reset the commandBar if is a WalkableArea', function(){

      sinon.spy(commandbar, 'showCannotMessage');
      sinon.spy(commandbar, 'resetCommand');

      var Mock = WalkableArea.extend({
        _buildActions: function(){ },
      });

      var obj = new Mock({
        shape: new Rectangle(),
        commands: [ 'walkto' ],
        actions: [ new Command('use') ],
      });

      obj.game = fakeGame;
      obj.updateActions(dt);

      expect(commandbar.showCannotMessage).to.have.been.calledWith(obj);
      expect(commandbar.resetCommand).to.not.have.been.called;

      expect(obj.actions.length).to.be.equal(0);

      commandbar.showCannotMessage.restore();
      commandbar.resetCommand.restore();
    });

  });

  describe('update with inventory item', function(){

    var testInventoryItemName = 'testObjName';

    var commandbar2 = {
      name: 'CommandBar',
      showHoverMessage: function() {},
      hideHoverMessage: function() {},
      showCannotMessage: function() {},
      resetCommand: function() {},
      inventory: { current: testInventoryItemName }
    };

    var walkablearea2 = {
      name: 'WalkableArea',
      moveWalkersToObject: function(){}
    };

    var fakeGame2 = {
      inputs: { cursor: { isDown: false, position: new Point() } },
      findOne: function(name){
        switch(name){
          case 'CommandBar': return commandbar2;
          case 'WalkableArea': return walkablearea2;
        }
      }
    };

    it('must run the command with the inventory item and finalize the action',
      function(){

      sinon.spy(commandbar2, 'resetCommand');

      var cmdAction = new Command('use');

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      var useCalled = 0;
      obj.onCommand = {
        use: function(inventoryItemName){
          expect(inventoryItemName).to.be.equal(testInventoryItemName);
          useCalled++;
        }
      };

      obj.game = fakeGame2;

      expect(commandbar2.inventory.current).to.be.equal(testInventoryItemName);

      obj.updateActions(dt);

      expect(commandbar2.resetCommand).to.have.been.called;

      expect(obj.actions.length).to.be.equal(0);
      expect(useCalled).to.be.equal(1);
      expect(commandbar2.inventory.current).to.be.null;

      commandbar2.resetCommand.restore();
    });

  });

});