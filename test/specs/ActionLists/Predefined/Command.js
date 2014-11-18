
var pac = require('../../../../src/pac');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Scene = require('../../../../src/Scene');
var CommandBar = require('../../../../src/prefabs/CommandBar');
var Command = require('../../../../src/actions/Command');

var Hoverable = require('../../../../src/actions/Hoverable');
var Clickable = require('../../../../src/actions/Clickable');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestObj = pac.Sprite.extend({
  texture: 'testTexture'
});

var fakeGame = {
  inputs: {
    cursor: {
      isDown: false,
      position: new Point()
    }
  }
};

var scene = new Scene({
  name: 'Scene01',
  size: { width: 500, height: 600 }
});

scene.game = fakeGame;

var commandBar = new CommandBar({
  position: new Point(0, 500),
  size: { width: 800, height: 100 },
  cannotHolder: 'I certain cannot {{action}} that',
  messageBox: {
    position: new Point(10, 20)
  },
  commands: {
    'use': 'Use',
    'push': 'Push',
    'pull': 'Pull'
  },
  current: 'use',
  style: {
    position: new Point(10, 20),
    margin: { x: 10, y: 5 },
    size: { width: 200, height: 40 },
    text: {
      fill: 'black',
    },
    hover: {
      fill: 'black'
    },
    active: {
      fill: 'black'
    },
    grid: [['use','push', 'pull']],
  }
});

var dt = 0.16;

describe('Command', function(){

  it('must throw an error if a command bar is not found', function(){

    var noCommandBarScene = new Scene({
      name: 'Scene01',
      size: { width: 500, height: 600 }
    });

    noCommandBarScene.game = fakeGame;

    var obj = new TestObj({
      shape: new Rectangle(),
      actions: [ new Command() ],
    });

    noCommandBarScene.addObject(obj);

    expect(function(){
      noCommandBarScene._update(dt);
      noCommandBarScene._update(dt);
    }).to.throw('A CommandBar was not found on this scene.');

  });

  it('must init the action on start', function(){

    var cmdAction = new Command();

    var obj = new TestObj({
      shape: new Rectangle(),
      actions: [ cmdAction ],
    });

    // must require Hoverable & Clickable
    expect(cmdAction.requires).to.be.a('array');
    expect(cmdAction.requires.length).to.be.equal(2);
    expect(cmdAction.requires[0]).to.be.equal(Hoverable);
    expect(cmdAction.requires[1]).to.be.equal(Clickable);

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    expect(obj.actions.length).to.be.equal(3);

    expect(cmdAction.commandBar).to.be.equal(commandBar);
    expect(cmdAction.isHovering).to.be.false;

    scene.objects.clear();
  });

  it('must fire onCommand events on GameObject when clicked', function(){

    var cmdAction = new Command();

    var useCalled = 0;
    var pushCalled = 0;

    var obj;

    var ObjAction = TestObj.extend({
      onCommand: {
        use: function(){
          useCalled++;
          expect(this).to.be.equal(obj);
        },
        push: function(){
          pushCalled++;
          expect(this).to.be.equal(obj);
        }
      }

    });

    obj = new ObjAction({
      shape: new Rectangle(),
      actions: [ cmdAction ]
    });

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    expect(useCalled).to.be.equal(0);
    expect(pushCalled).to.be.equal(0);

    // remove hover and click from actions to test only command
    var hoverable = obj.actions.at(0);
    var clickable = obj.actions.at(1);
    obj.actions.remove(hoverable);
    obj.actions.remove(clickable);

    obj.isClicked = true;
    scene._update(dt);

    expect(useCalled).to.be.equal(1);
    expect(pushCalled).to.be.equal(0);

    commandBar.current = 'push';
    scene._update(dt);

    expect(useCalled).to.be.equal(1);
    expect(pushCalled).to.be.equal(1);

    commandBar.current = 'use';
    scene.objects.clear();
  });

  it('must fire call MessageBox events on commandBar when hover', function(){

    sinon.spy(commandBar, 'showHoverMessage');
    sinon.spy(commandBar, 'hideHoverMessage');
    sinon.spy(commandBar, 'showCannotMessage');

    var cmdAction = new Command();

    var ObjAction = TestObj.extend({
      name: 'Weird Thing',
      onCommand: {
        use: function(){
          // do somehting without returning anything
        },
        push: function(){
          return 'cannot push this weird thing!';
        }
      }

    });

    var obj = new ObjAction({
      shape: new Rectangle(),
      actions: [ cmdAction ]
    });

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.not.have.been.called;
    expect(commandBar.hideHoverMessage).to.not.have.been.called;
    expect(commandBar.showCannotMessage).to.not.have.been.called;

    // remove hover and click from actions to test only command
    var hoverable = obj.actions.at(0);
    var clickable = obj.actions.at(1);
    obj.actions.remove(hoverable);
    obj.actions.remove(clickable);

    obj.isHover = true;

    scene._update(dt);

    expect(commandBar.showHoverMessage).to.have.been.calledWith('Weird Thing');
    expect(commandBar.hideHoverMessage).to.not.have.been.called;
    expect(commandBar.showCannotMessage).to.not.have.been.called;

    commandBar.showHoverMessage.reset();

    obj.isHover = false;
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.not.have.been.called;
    expect(commandBar.hideHoverMessage).to.have.been.called;
    expect(commandBar.showCannotMessage).to.not.have.been.called;

    commandBar.hideHoverMessage.reset();

    obj.isClicked = true;
    obj.isHover = true;
    commandBar.current = 'push';
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.have.been.called;
    expect(commandBar.hideHoverMessage).to.not.have.been.called;

    expect(commandBar.showCannotMessage)
      .to.have.been.calledWith('cannot push this weird thing!');

    commandBar.showHoverMessage.reset();
    commandBar.showCannotMessage.reset();

    obj.isClicked = true;
    commandBar.current = 'pull';
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.not.have.been.called;
    expect(commandBar.hideHoverMessage).to.not.have.been.called;
    expect(commandBar.showCannotMessage).to.have.been.calledWith();

    commandBar.showHoverMessage.restore();
    commandBar.hideHoverMessage.restore();
    commandBar.showCannotMessage.restore();
  });

});