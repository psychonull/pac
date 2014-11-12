
var _ = require('../../../src/utils');
var Point = require('../../../src/Point');
var GameObjectList = require('../../../src/GameObjectList');

var CommandBar = require('../../../src/prefabs/CommandBar');
var Command = require('../../../src/prefabs/Command');

var Rectangle = require('../../../src/Rectangle');
var ActionList = require('../../../src/ActionList');
var Hoverable = require('../../../src/actions/Hoverable');
var Clickable = require('../../../src/actions/Clickable');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var commandBarOpts = {
  position: new Point(200, 200),
  size: { width: 500, height: 100 },

  cannotHolder: 'I certain cannot {{action}} that',

  commands: {
    'use': 'Use',
    'walkto': 'Walk To',
    'push': 'Push',
    'talkto': 'Talk To'
  },

  current: 'use',

  style: {

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

    margin: { x: 10, y: 5 },
    size: { width: 200, height: 40 },

    grid: [
      ['use',  'walkto'],
      ['push', 'talkto']
    ],
  },

};

var gridPositions = {
  'use': { x: 10, y: 5 },
  'walkto': { x: 220, y: 5 },
  'push': { x: 10, y: 50 },
  'talkto': { x: 220, y: 50 }
};

describe('CommandBar', function(){

  it('must allow to create a CommandBar', function(){

    var cbar = new CommandBar(_.clone(commandBarOpts, true));

    expect(cbar.position.x).to.be.equal(200);
    expect(cbar.position.y).to.be.equal(200);

    expect(cbar.size.width).to.be.equal(500);
    expect(cbar.size.height).to.be.equal(100);

    expect(cbar.style.text.fill).to.be.equal('#000');
    expect(cbar.style.hover.fill).to.be.equal('#111');
    expect(cbar.style.active.fill).to.be.equal('#222');

    expect(cbar.cannotHolder).to.be.equal('I certain cannot {{action}} that');

    expect(cbar.current).to.be.equal('use');
    expect(cbar.children).to.be.instanceof(GameObjectList);

    var cSize = cbar.style.size;
    expect(cSize.width).to.be.equal(200);
    expect(cSize.height).to.be.equal(40);

    var cMargin = cbar.style.margin;
    expect(cMargin.x).to.be.equal(10);
    expect(cMargin.y).to.be.equal(5);

    // check commands creation
    var i = 0;
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

        var pos = gridPositions[child.command];
        expect(child.localPosition.x).to.be.equal(pos.x);
        expect(child.localPosition.y).to.be.equal(pos.y);

        expect(child.position.x).to.be.equal(pos.x + cbar.position.x);
        expect(child.position.y).to.be.equal(pos.y + cbar.position.y);

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
      cpos.x+cbar.position.x+10,
      cpos.y+cbar.position.y+10);

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
      cpos.x+cbar.position.x+10,
      cpos.y+cbar.position.y+10);
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
      cpos.x+cbar.position.x+10,
      cpos.y+cbar.position.y+10);

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
      cpos.x+cbar.position.x+10,
      cpos.y+cbar.position.y+10);
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

});