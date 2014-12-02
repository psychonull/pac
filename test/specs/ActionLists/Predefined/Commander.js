
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var Hoverable = require('../../../../src/actions/Hoverable');
var Clickable = require('../../../../src/actions/Clickable');

var Commander = require('../../../../src/actions/Commander');

var Command = require('../../../../src/actions/Command');
var InventoryCommand = require('../../../../src/actions/InventoryCommand');
var WalkerCommand = require('../../../../src/actions/WalkerCommand');


var WalkableArea = require('../../../../src/prefabs/WalkableArea');
var Rectangle = require('../../../../src/Rectangle');

var TestObj = Sprite.extend({
  texture: 'testTexture',
  size: { width: 50, height: 50 }
});

var dt = 0.16;

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var commandbar = {
  name: 'CommandBar',
  showHoverMessage: function() {},
  hideHoverMessage: function() {}
};

var walkablearea = {
  name: 'WalkableArea',
  commands: ['walkto'],
  moveWalkersToObject: function(){},
  getWalker: function(){
    return {
      name: 'Walker',
      walkingTo: new Point(1,1),
      targetReached: false
    };
  }
};

var fakeGame = {
  inputs: { cursor: { isDown: false, position: new Point() } },
  findOne: function(name){
    switch(name){
      case 'CommandBar': return commandbar;
      case 'WalkableArea': return walkablearea;
    }
    return null;
  }
};

function removeActions(obj){
  // remove hover and click from actions to test only commander
  obj.actions
    .removeAll(Hoverable)
    .removeAll(Clickable);
}

describe('Commander', function(){

  describe('onStart', function(){

    it('must throw an error if a command bar is not found', function(){

      var obj = new TestObj({
        shape: true,
        actions: [ new Commander() ],
      });

      obj.game = {
        inputs: { cursor: { isDown: false, position: new Point() } },
        findOne: function(){ return undefined; }
      };

      expect(function(){
        obj.updateActions(dt);
        obj.updateActions(dt);
      }).to.throw('A CommandBar was not found.');

    });

    it('must init the action', function(){

      var cmdAction = new Commander();

      var obj = new TestObj({
        shape: true,
        actions: [ cmdAction ],
      });

      obj.game = fakeGame;

      // must require Hoverable & Clickable
      expect(cmdAction.requires).to.be.a('array');
      expect(cmdAction.requires.length).to.be.equal(2);
      expect(cmdAction.requires[0]).to.be.equal(Hoverable);
      expect(cmdAction.requires[1]).to.be.equal(Clickable);
      expect(cmdAction.nearness).to.be.equal(30);

      obj.updateActions(dt);
      obj.updateActions(dt);

      expect(obj.actions.length).to.be.equal(3);

      expect(cmdAction.commandBar.name).to.be.equal('CommandBar');
      expect(cmdAction.walkableArea.name).to.be.equal('WalkableArea');
    });

  });

  describe('update', function(){

    it ('must toggle commandBar messages on hover in and out', function(){

      sinon.spy(commandbar, 'showHoverMessage');
      sinon.spy(commandbar, 'hideHoverMessage');

      var obj = new TestObj({
        shape: true,
        actions: [ new Commander() ],
      });

      obj.game = fakeGame;

      obj.updateActions(dt);
      obj.updateActions(dt);

      removeActions(obj);

      obj.isHover = false;
      obj.updateActions(dt);
      expect(commandbar.showHoverMessage).to.not.have.been.called;
      expect(commandbar.hideHoverMessage).to.not.have.been.called;

      obj.isHover = true;
      obj.updateActions(dt);
      expect(commandbar.showHoverMessage).to.have.been.calledWith(obj);
      expect(commandbar.hideHoverMessage).to.not.have.been.called;

      commandbar.showHoverMessage.reset();

      obj.updateActions(dt);
      expect(commandbar.showHoverMessage).to.not.have.been.called;
      expect(commandbar.hideHoverMessage).to.not.have.been.called;

      obj.isHover = false;
      obj.updateActions(dt);
      expect(commandbar.showHoverMessage).to.not.have.been.called;
      expect(commandbar.hideHoverMessage).to.have.been.calledWith(obj);

      commandbar.hideHoverMessage.reset();

      obj.updateActions(dt);
      expect(commandbar.showHoverMessage).to.not.have.been.called;
      expect(commandbar.hideHoverMessage).to.not.have.been.called;

      commandbar.showHoverMessage.restore();
      commandbar.hideHoverMessage.restore();
    });

    it ('must call onClick when the owner is clicked', function(){

      var commander = new Commander();

      sinon.spy(commander, 'onClick');

      var obj = new TestObj({
        shape: true,
        actions: [ commander ],
      });

      obj.game = fakeGame;

      obj.updateActions(dt);
      obj.updateActions(dt);

      removeActions(obj);

      commandbar.current = 'use';

      obj.isClicked = false;
      obj.updateActions(dt);
      expect(commander.onClick).to.not.have.been.called;

      obj.isClicked = true;
      obj.updateActions(dt);
      expect(commander.onClick).to.have.been.calledWith(obj, 'use');

      commander.onClick.reset();

      obj.isClicked = false;
      obj.updateActions(dt);
      expect(commander.onClick).to.not.have.been.called;

      commander.onClick.restore();
    });

  });

  describe('onClick', function(){

    it ('must create a Command Action', function(){

      var commander = new Commander();

      var obj = new TestObj({
        shape: true,
        actions: [ commander ],
      });

      // a game without walkable area
      obj.game = {
        inputs: { cursor: { isDown: false, position: new Point() } },
        findOne: function(name){

          switch(name){

            case 'CommandBar':
              return commandbar;

            case 'WalkableArea':
              return null;
          }

          return null;
        }
      };

      obj.updateActions(dt);
      obj.updateActions(dt);
      expect(obj.actions.has(Command)).to.be.false;

      commander.onClick(obj, 'use');

      expect(obj.actions.has(Command)).to.be.true;
      expect(obj.actions.has(InventoryCommand)).to.be.false;
      expect(obj.actions.has(WalkerCommand)).to.be.false;

      expect(obj.actions.at(0).name).to.be.equal('Command');
      expect(obj.actions.at(0).command).to.be.equal('use');

    });

    it ('must create an InventoryCommand Action', function(){

      sinon.spy(walkablearea, 'moveWalkersToObject');
      var commander = new Commander();

      var obj = new TestObj({
        shape: true,
        actions: [ commander ],
      });

      obj.game = fakeGame;
      obj.isInInventory = true;

      obj.updateActions(dt);

      expect(obj.actions.has(InventoryCommand)).to.be.false;
      expect(obj.actions.has(Command)).to.be.false;

      expect(walkablearea.moveWalkersToObject).to.not.have.been.called;

      commander.onClick(obj, 'use');

      expect(obj.actions.has(InventoryCommand)).to.be.true;
      expect(obj.actions.has(Command)).to.be.false;
      expect(obj.actions.has(WalkerCommand)).to.be.false;
      expect(walkablearea.moveWalkersToObject).to.not.have.been.called;

      expect(obj.actions.at(0).name).to.be.equal('InventoryCommand');
      expect(obj.actions.at(0).command).to.be.equal('use');

      walkablearea.moveWalkersToObject.restore();
    });

    it ('must create a WalkerCommand Action', function(){

      sinon.spy(walkablearea, 'moveWalkersToObject');

      var commander = new Commander(5);

      var obj = new TestObj({
        shape: true,
        actions: [ commander ],
      });

      obj.game = fakeGame;

      obj.updateActions(dt);
      obj.updateActions(dt);

      expect(commander.walkableArea).to.be.equal(walkablearea);

      expect(obj.actions.has(WalkerCommand)).to.be.false;
      expect(obj.actions.has(Command)).to.be.false;

      commander.onClick(obj, 'use');

      expect(walkablearea.moveWalkersToObject)
        .to.have.been.calledWith(obj, 5);

      obj.updateActions(dt);
      expect(obj.actions.has(WalkerCommand)).to.be.true;
      expect(obj.actions.has(Command)).to.be.false;

      expect(obj.actions.at(0).name).to.be.equal('WalkerCommand');
      expect(obj.actions.at(0).command).to.be.equal('use');

      walkablearea.moveWalkersToObject.restore();
    });

    it ('must NOT create a WalkerCommand Action if is a cancel', function(){

      var commander = new Commander({ nearness: 10 });

      var obj = new TestObj({
        shape: true,
        actions: [ commander ],
      });

      var cancelWalkableArea = {
        name: 'WalkableArea',
        moveWalkersToObject: function(){ },
        getWalker: function(){
          return {
            name: 'Walker',
            walkingTo: null,
            targetReached: false
          };
        }
      };

      sinon.spy(cancelWalkableArea, 'moveWalkersToObject');

      obj.game = {
        inputs: { cursor: { isDown: false, position: new Point() } },
        findOne: function(name){

          switch(name){

            case 'CommandBar':
              return commandbar;

            case 'WalkableArea':
              return cancelWalkableArea;
          }

          return null;
        }
      };

      obj.updateActions(dt);
      obj.updateActions(dt);

      expect(commander.walkableArea).to.be.equal(cancelWalkableArea);

      expect(obj.actions.has(WalkerCommand)).to.be.false;
      expect(obj.actions.has(Command)).to.be.false;

      commander.onClick(obj, 'use');

      expect(cancelWalkableArea.moveWalkersToObject)
        .to.have.been.calledWith(obj, 10);

      obj.updateActions(dt);
      expect(obj.actions.has(WalkerCommand)).to.be.false;
      expect(obj.actions.has(Command)).to.be.false;

      cancelWalkableArea.moveWalkersToObject.restore();
    });

    it ('must create a Command Action if the object is a WalkableArea',
      function(){

      var commander = new Commander();

      var Mock = WalkableArea.extend({
        _buildActions: function(){ },
      });

      var obj = new Mock({
        shape: new Rectangle(),
        commands: [ 'walkto' ],
        actions: [ commander ],
      });

      obj.game = fakeGame;

      removeActions(obj);

      obj.updateActions(dt);
      obj.updateActions(dt);

      expect(obj.actions.has(Command)).to.be.false;

      commander.onClick(obj, 'use');

      expect(obj.actions.has(Command)).to.be.true;
      expect(obj.actions.has(InventoryCommand)).to.be.false;
      expect(obj.actions.has(WalkerCommand)).to.be.false;

      expect(obj.actions.at(0).name).to.be.equal('Command');
      expect(obj.actions.at(0).command).to.be.equal('use');

    });

  });

});