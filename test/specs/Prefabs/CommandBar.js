
var _ = require('../../../src/utils');
var Point = require('../../../src/Point');
var GameObjectList = require('../../../src/GameObjectList');

var CommandBar = require('../../../src/prefabs/CommandBar');
var Command = require('../../../src/prefabs/Command');

var Text = require('../../../src/Text');
var Rectangle = require('../../../src/Rectangle');
var ActionList = require('../../../src/ActionList');
var Hoverable = require('../../../src/actions/Hoverable');
var Clickable = require('../../../src/actions/Clickable');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var fakeInventory = {
  current: null,
  has: function(){},
  add: function(){},
  remove: function(){}
};

var commandBarOpts = {
  position: new Point(200, 200),
  size: { width: 500, height: 100 },

  cannotHolder: 'I certain cannot {{action}} that',

  messageBox: {
    position: new Point(10, 20),
    font: '20px Arial',
    fill: '#fff',
  },

  inventory: fakeInventory,
  inventoryCommands: {
    'use': 'with',
    'give': 'to'
  },

  commands: {
    'use': 'Use',
    'walkto': 'Walk To',
    'give': 'Push',
    'talkto': 'Talk To'
  },

  current: 'use',

  style: {

    position: new Point(10, 20),
    margin: { x: 10, y: 5 },
    size: { width: 200, height: 40 },

    text: {
      font: '20px Arial',
      fill: '#000',
    },

    hover:{
      fill: '#111',
    },

    active: {
      fill: '#222',
    },

    grid: [
      ['use',  'walkto'],
      ['give', 'talkto']
    ],
  },

};

var gridPositions = {
  'use': { x: 10, y: 5 },
  'walkto': { x: 220, y: 5 },
  'give': { x: 10, y: 50 },
  'talkto': { x: 220, y: 50 }
};

describe('CommandBar', function(){

  it('must allow to create a CommandBar', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    expect(cbar.name).to.be.equal('CommandBar');

    expect(cbar.position.x).to.be.equal(200);
    expect(cbar.position.y).to.be.equal(200);

    expect(cbar.size.width).to.be.equal(500);
    expect(cbar.size.height).to.be.equal(100);

    expect(cbar.style.text.font).to.be.equal('20px Arial');
    expect(cbar.style.text.fill).to.be.equal('#000');
    expect(cbar.style.hover.fill).to.be.equal('#111');
    expect(cbar.style.active.fill).to.be.equal('#222');

    expect(cbar.cannotHolder).to.be.equal('I certain cannot {{action}} that');

    expect(cbar.messageBox).to.be.instanceof(Text);
    expect(cbar.messageBox.font).to.be.equal('20px Arial');
    expect(cbar.messageBox.fill).to.be.equal('#fff');
    expect(cbar.messageBox.position.x).to.be.equal(210);
    expect(cbar.messageBox.position.y).to.be.equal(220);

    expect(cbar.inventory.current).to.be.null;
    expect(cbar.inventoryCommands).to.be.ok;

    expect(cbar.current).to.be.equal('use');
    expect(cbar.children).to.be.instanceof(GameObjectList);

    var cSize = cbar.style.size;
    expect(cSize.width).to.be.equal(200);
    expect(cSize.height).to.be.equal(40);

    var cMargin = cbar.style.margin;
    expect(cMargin.x).to.be.equal(10);
    expect(cMargin.y).to.be.equal(5);

    // check commands creation
    var i = 1; // index 0 is for the message bar
    for(var c in cbar.commands){

      if (cbar.commands.hasOwnProperty(c)){

        var comm = cbar.commands[c];
        var child = cbar.children.at(i);

        expect(child).to.be.instanceof(Command);
        expect(child.command).to.be.equal(c);
        expect(child.value).to.be.equal(comm);

        expect(child.font).to.be.equal(cbar.style.text.font);
        if (child.command === cbar.current){
          expect(child.fill).to.be.equal(cbar.style.active.fill);
        }
        else {
          expect(child.fill).to.be.equal(cbar.style.text.fill);
        }

        expect(child.actions).to.be.instanceof(ActionList);
        expect(child.actions.at(0)).to.be.instanceof(Hoverable);
        expect(child.actions.at(1)).to.be.instanceof(Clickable);

        var hitbox = child.shape;
        expect(hitbox).to.be.instanceof(Rectangle);
        expect(hitbox.size.width).to.be.equal(cSize.width);
        expect(hitbox.size.height).to.be.equal(cSize.height);

        var cmdOffset = commandBarOpts.style.position;

        var pos = gridPositions[child.command];
        expect(child.localPosition.x).to.be.equal(pos.x + cmdOffset.x);
        expect(child.localPosition.y).to.be.equal(pos.y + cmdOffset.y);

        var cPosX = pos.x + cbar.position.x + cmdOffset.x;
        var cPosY = pos.y + cbar.position.y + cmdOffset.y;
        expect(child.position.x).to.be.equal(cPosX);
        expect(child.position.y).to.be.equal(cPosY);

        i++;
      }
    }
  });

  it('must interact with hover and click events on commands', function(){
    var fakeGame = {
      inputs: {
        cursor: {
          isDown: false,
          position: new Point()
        }
      }
    };

    sinon.spy(CommandBar.prototype, 'onCommandHoverIn');
    sinon.spy(CommandBar.prototype, 'onCommandHoverOut');
    sinon.spy(CommandBar.prototype, 'onCommandClick');

    var cbar = new CommandBar(_.clone(commandBarOpts, true));
    cbar.game = fakeGame;

    var emitted = 0;
    cbar.on('command', function(command){
      expect(command).to.be.equal('walkto');
      emitted++;
    });

    var cursor = fakeGame.inputs.cursor;

    // make a hover on a Command 'walkto'
    var cpos = gridPositions.walkto;

    cursor.position = new Point(
      cpos.x+cbar.position.x+30,
      cpos.y+cbar.position.y+30);

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(cbar.onCommandHoverIn).to.have.been.calledOnce;

    cursor.position = new Point(
      cpos.x+cbar.position.x-50,
      cpos.y+cbar.position.y-50);

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(cbar.onCommandHoverOut).to.have.been.calledOnce;

    cursor.position = new Point(
      cpos.x+cbar.position.x+30,
      cpos.y+cbar.position.y+30);
    cursor.isDown = true;

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(cbar.onCommandHoverIn).to.have.been.calledTwice;
    expect(cbar.onCommandClick).to.have.been.calledOnce;
    expect(emitted).to.be.equal(1);

    CommandBar.prototype.onCommandHoverIn.restore();
    CommandBar.prototype.onCommandHoverOut.restore();
    CommandBar.prototype.onCommandClick.restore();
  });

  it('must change command styles on hover and click', function(){
    var fakeGame = {
      inputs: {
        cursor: {
          isDown: false,
          position: new Point()
        }
      }
    };

    var cbar = new CommandBar(_.clone(commandBarOpts, true));
    cbar.game = fakeGame;

    var cursor = fakeGame.inputs.cursor;

    // make a hover on a Command 'walkto'
    var cpos = gridPositions.walkto;

    var commandWalkTo = null;
    var commandUse = null;

    cbar.children.each(function(cmd){
      if (cmd.command === 'walkto'){
        commandWalkTo = cmd;
      }
      if (cmd.command === 'use'){
        commandUse = cmd;
      }
    });

    var styles = commandBarOpts.style;
    var normal = styles.text.fill;
    var hover = styles.hover.fill;
    var active = styles.active.fill;

    expect(commandUse).to.not.be.null;
    expect(commandUse.command).to.be.equal('use');
    expect(commandUse.fill).to.be.equal(active);

    expect(commandWalkTo).to.not.be.null;
    expect(commandWalkTo.command).to.be.equal('walkto');
    expect(commandWalkTo.fill).to.be.equal(normal);

    expect(cbar.current).to.be.equal('use');

    // HOVER IN
    cursor.position = new Point(
      cpos.x+cbar.position.x+30,
      cpos.y+cbar.position.y+30);

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(commandWalkTo.fill).to.be.equal(hover);
    expect(cbar.current).to.be.equal('use');

    // HOVER OUT
    cursor.position = new Point(
      cpos.x+cbar.position.x-50,
      cpos.y+cbar.position.y-50);

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(commandWalkTo.fill).to.be.equal(normal);
    expect(cbar.current).to.be.equal('use');

    // HOVER IN & CLICK
    cursor.position = new Point(
      cpos.x+cbar.position.x+30,
      cpos.y+cbar.position.y+30);
    cursor.isDown = true;

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(commandWalkTo.fill).to.be.equal(active);
    expect(cbar.current).to.be.equal('walkto');

    //change style of current before
    expect(commandUse.fill).to.be.equal(normal);

    // HOVER OUT (but its active now)
    cursor.position = new Point(
      cpos.x+cbar.position.x-50,
      cpos.y+cbar.position.y-50);

    cbar.updateHierarchy(0.16);
    cbar.updateActions(0.16);

    expect(commandWalkTo.fill).to.be.equal(active);
  });

  it('must allow to show and hide messages', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    expect(cbar.showHoverMessage).to.be.a('function');
    expect(cbar.hideHoverMessage).to.be.a('function');
    expect(cbar.showCannotMessage).to.be.a('function');

    var fakeObj = {
      cid: '123456789',
      name: 'Crazy Monkey'
    };

    var fakeObj2 = {
      cid: '987654321',
      name: 'Crazy Monkey 2'
    };

    cbar.showHoverMessage(fakeObj);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj.cid);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey');

    cbar.hideHoverMessage(fakeObj2);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj.cid);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey');

    cbar.hideHoverMessage(fakeObj);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj.cid);
    expect(cbar.messageBox.value).to.be.equal('');

    cbar.showCannotMessage(fakeObj);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj.cid);
    expect(cbar.messageBox.value).to.be.equal('I certain cannot Use that');

    cbar.showCannotMessage(fakeObj, 'My custom message');
    expect(cbar.lastRequestOf).to.be.equal(fakeObj.cid);
    expect(cbar.messageBox.value).to.be.equal('My custom message');

    cbar.showHoverMessage(fakeObj2);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj2.cid);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey 2');

    cbar.hideHoverMessage(fakeObj);
    expect(cbar.lastRequestOf).to.be.equal(fakeObj2.cid);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey 2');
  });

  it('must allow to show inventory join messages', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    var fakeObj = {
      cid: '123456789',
      name: 'Crazy Monkey'
    };

    var fakeObj2 = {
      cid: '987654321',
      name: 'Crazy Monkey 2'
    };

    cbar.setCommand('use');

    cbar.showHoverMessage(fakeObj);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey');

    cbar.inventory.current = 'Crazy Monkey';

    cbar.showHoverMessage(fakeObj);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey with');

    cbar.showHoverMessage(fakeObj2);
    expect(cbar.messageBox.value)
      .to.be.equal('Use Crazy Monkey with Crazy Monkey 2');

    cbar.inventory.current = null;
  });

  it('must allow to reset a command', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    expect(cbar.resetCommand).to.be.a('function');

    expect(cbar._current.command).to.be.equal('use');

    cbar.setCommand('talkto');
    expect(cbar._current.command).to.be.equal('talkto');

    cbar.resetCommand();

    expect(cbar._current.command).to.be.equal('use');
  });

  it('must allow to be reset onEnterScene', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    expect(cbar.onEnterScene).to.be.a('function');

    expect(cbar._current.command).to.be.equal('use');

    var fakeObj = {
      cid: '123456789',
      name: 'Crazy Monkey'
    };

    cbar.showHoverMessage(fakeObj);
    expect(cbar.messageBox.value).to.be.equal('Use Crazy Monkey');

    cbar.setCommand('talkto');
    expect(cbar._current.command).to.be.equal('talkto');

    cbar.onEnterScene();

    expect(cbar._current.command).to.be.equal('use');
    expect(cbar.messageBox.value).to.be.equal('');
  });

});