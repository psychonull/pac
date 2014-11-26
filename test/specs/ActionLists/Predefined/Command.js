
var pac = require('../../../../src/pac');

var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');
var Rectangle = require('../../../../src/Rectangle');
var Scene = require('../../../../src/Scene');
var CommandBar = require('../../../../src/prefabs/CommandBar');
var Command = require('../../../../src/actions/Command');

var Inventory = require('../../../../src/prefabs/Inventory');

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

var inventory = new Inventory({

  position: new Point(200, 200),
  size: { width: 500, height: 100 },

  maxItems: 4,

  style: {

    itemsPerRow: 2,

    position: new Point(10, 20),
    margin: { x: 10, y: 5 },
    size: { width: 200, height: 40 },

    holder: {
      stroke: '#fff',
      fill: '#000',
    }

  },

});

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
    'pull': 'Pull',
    'give': 'Give'
  },

  inventory: inventory,
  inventoryCommands: {
    'use': 'with'
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

var fakeGame = {
  inputs: {
    cursor: {
      isDown: false,
      position: new Point()
    }
  },

  findOne: function(){
    return commandBar;
  }
};

var scene = new Scene({
  name: 'Scene01',
  size: { width: 500, height: 600 }
});

scene.game = fakeGame;

var dt = 0.16;

describe('Command', function(){

  it('must throw an error if a command bar is not found', function(){

    var noCommandBarScene = new Scene({
      name: 'Scene01',
      size: { width: 500, height: 600 }
    });

    noCommandBarScene.game = {
      inputs: { cursor: { isDown: false, position: new Point() } },
      findOne: function(){ return undefined; }
    };

    var obj = new TestObj({
      shape: new Rectangle(),
      actions: [ new Command() ],
    });

    noCommandBarScene.addObject(obj);

    expect(function(){
      noCommandBarScene._update(dt);
      noCommandBarScene._update(dt);
    }).to.throw('A CommandBar was not found.');

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

    commandBar.setCommand('push');
    scene._update(dt);

    expect(useCalled).to.be.equal(1);
    expect(pushCalled).to.be.equal(1);

    commandBar.setCommand('use');
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

    expect(commandBar.showHoverMessage)
      .to.have.been.calledWith(obj);
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
    commandBar.setCommand('push');
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.have.been.called;
    expect(commandBar.hideHoverMessage).to.not.have.been.called;

    expect(commandBar.showCannotMessage)
      .to.have.been.calledWith(obj, 'cannot push this weird thing!');

    commandBar.showHoverMessage.reset();
    commandBar.showCannotMessage.reset();

    obj.isClicked = true;
    commandBar.setCommand('pull');
    scene._update(dt);

    expect(commandBar.showHoverMessage).to.not.have.been.called;
    expect(commandBar.hideHoverMessage).to.not.have.been.called;
    expect(commandBar.showCannotMessage).to.have.been.calledWith(obj);

    commandBar.showHoverMessage.restore();
    commandBar.hideHoverMessage.restore();
    commandBar.showCannotMessage.restore();

    commandBar.setCommand('use');
    scene.objects.clear();
  });

  it('must not run disabled commands', function(){

    commandBar.onEnterScene();

    var cmdAction = new Command();

    var ObjAction = pac.Sprite.extend({
      texture: 'testTexture',
      name: 'Weird Thing'
    });

    var obj = new ObjAction({
      shape: new Rectangle(),
      actions: [ cmdAction ]
    });

    obj.onCommand = {
      use: false
    };

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    // remove hover and click from actions to test only command
    var hoverable = obj.actions.at(0);
    var clickable = obj.actions.at(1);
    obj.actions.remove(hoverable);
    obj.actions.remove(clickable);

    commandBar.messageBox.value = '';

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = false;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isClicked = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    commandBar.setCommand('use');
    scene.objects.clear();
  });

  it('must not show messages on SPECIFIC hidden commands', function(){

    commandBar.onEnterScene();

    var ObjAction = pac.Sprite.extend({
      texture: 'testTexture'
    });

    var obj = new ObjAction({
      name: 'Object',
      shape: new Rectangle(),
      actions: [ new Command() ]
    });

    var calledUse = 0;
    var calledPull = 0;

    obj.hiddenCommands = [ 'use' ];
    obj.onCommand = {
      use: function(){
        calledUse++;
      },
      pull: function(){
        calledPull++;
      }
    };

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    // remove hover and click from actions to test only command
    var hoverable = obj.actions.at(0);
    var clickable = obj.actions.at(1);
    obj.actions.remove(hoverable);
    obj.actions.remove(clickable);

    commandBar.messageBox.value = '';

    // USE

    obj.isHover = true;
    scene._update(dt);

    expect(calledUse).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = false;
    scene._update(dt);

    expect(calledUse).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isClicked = true;
    scene._update(dt);

    expect(calledUse).to.be.equal(1);
    expect(commandBar.messageBox.value).to.be.equal('');

    // PULL

    obj.isClicked = false;
    obj.isHover = false;
    commandBar.setCommand('pull');
    scene._update(dt);

    obj.isHover = true;
    scene._update(dt);

    expect(calledPull).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('Pull Object');

    obj.isHover = false;
    scene._update(dt);

    expect(obj.isClicked).to.be.false;

    expect(calledPull).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('Pull Object');

    obj.isClicked = true;
    scene._update(dt);

    expect(calledPull).to.be.equal(1);

    // TODO: Clear Message box after run command
    //expect(commandBar.messageBox.value).to.be.equal('');

    commandBar.setCommand('use');
    scene.objects.clear();
  });

  it('must not show messages on ALL hidden commands', function(){

    commandBar.onEnterScene();

    var ObjAction = pac.Sprite.extend({
      texture: 'testTexture'
    });

    var obj = new ObjAction({
      name: 'Object',
      shape: new Rectangle(),
      actions: [ new Command() ]
    });

    var calledUse = 0;
    var calledPull = 0;

    obj.hiddenCommands = true;
    obj.onCommand = {
      use: function(){
        calledUse++;
      },
      pull: function(){
        calledPull++;
      }
    };

    scene.addObject(commandBar);
    scene.addObject(obj);
    scene._update(dt);
    scene._update(dt);

    // remove hover and click from actions to test only command
    var hoverable = obj.actions.at(0);
    var clickable = obj.actions.at(1);
    obj.actions.remove(hoverable);
    obj.actions.remove(clickable);

    commandBar.messageBox.value = '';

    // USE

    obj.isHover = true;
    scene._update(dt);

    expect(calledUse).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = false;
    scene._update(dt);

    expect(calledUse).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isClicked = true;
    scene._update(dt);

    expect(calledUse).to.be.equal(1);
    expect(commandBar.messageBox.value).to.be.equal('');

    // PULL

    commandBar.setCommand('pull');

    obj.isHover = false;
    obj.isClicked = false;
    scene._update(dt);

    obj.isHover = true;
    scene._update(dt);

    expect(calledPull).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = false;
    scene._update(dt);

    expect(calledPull).to.be.equal(0);
    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isHover = true;
    scene._update(dt);

    expect(commandBar.messageBox.value).to.be.equal('');

    obj.isClicked = true;
    scene._update(dt);

    expect(calledPull).to.be.equal(1);
    //TODO: Clear message box after run command
    //expect(commandBar.messageBox.value).to.be.equal('');

    commandBar.setCommand('use');
    scene.objects.clear();
  });

});

describe('Commands at Inventory', function(){

  var scene2;
  before(function(){
    // reset command bar to test with inventory
    commandBar.onEnterScene();

    scene2 = new Scene({
      name: 'Scene02',
      size: { width: 500, height: 600 }
    });

    scene2.game = fakeGame;
  });

  it('must fire onCommand events with inventory', function(){

    sinon.spy(commandBar, 'showHoverMessage');
    sinon.spy(commandBar, 'hideHoverMessage');
    sinon.spy(commandBar, 'showCannotMessage');

    var invCalled = 0;
    var sceneCalled = 0;

    var ObjInventory = TestObj.extend({
      onCommand: {
        use: function(withObj){
          invCalled++;
          expect(withObj).to.be.equal('inventoryObj');
          expect(this.name).to.be.equal('inventoryObj2');
        },
        push: function(){

        }
      }

    });

    var ObjScene = TestObj.extend({
      onCommand: {
        use: function(withObj){
          expect(withObj).to.be.equal('inventoryObj');
          sceneCalled++;
        },
        push: function(){

        }
      }

    });

    var objInv = new ObjInventory({
      name: 'inventoryObj',
      shape: new Rectangle(),
      actions: [ new Command() ]
    });

    var objInv2 = new ObjInventory({
      name: 'inventoryObj2',
      shape: new Rectangle(),
      actions: [ new Command() ]
    });

    var objSce = new ObjScene({
      name: 'sceneObj',
      shape: new Rectangle(),
      actions: [ new Command() ]
    });

    scene2.addObject(inventory);
    scene2.addObject(commandBar);
    scene2.addObject(objSce);

    inventory.add(objInv);
    inventory.add(objInv2);

    scene2._update(dt);
    scene2._update(dt);

    expect(invCalled).to.be.equal(0);
    expect(sceneCalled).to.be.equal(0);

    // remove hover and click from actions to test only command
    function clearHoverAndClick(obj){
      var hoverable = obj.actions.at(0);
      var clickable = obj.actions.at(1);
      obj.actions.remove(hoverable).remove(clickable);
    }

    clearHoverAndClick(objInv);
    clearHoverAndClick(objInv2);
    clearHoverAndClick(objSce);

    //start test cicle

    objInv.isHover = true;
    objInv.isClicked = true;
    scene2._update(dt);

    expect(inventory.current).to.be.equal(objInv.name);

    expect(commandBar.showHoverMessage).to.have.been.calledWith(objInv);
    expect(commandBar.messageBox.value).to.be.equal('Use inventoryObj with');

    expect(invCalled).to.be.equal(0); //must not call use of invObj

    objInv.isHover = false;
    objInv.isClicked = false;
    scene2._update(dt);

    // must keep the message on hide
    expect(commandBar.hideHoverMessage).to.have.been.called;
    expect(commandBar.messageBox.value).to.be.equal('Use inventoryObj with');

    objSce.isHover = true;
    objSce.isClicked = false;
    scene2._update(dt);

    expect(commandBar.showHoverMessage).to.have.been.calledWith(objSce);
    expect(commandBar.messageBox.value)
      .to.be.equal('Use inventoryObj with sceneObj');

    objSce.isHover = true;
    objSce.isClicked = true;
    scene2._update(dt);

    expect(sceneCalled).to.be.equal(1);
    expect(invCalled).to.be.equal(0);

    objSce.isHover = false;
    objSce.isClicked = false;
    scene2._update(dt);

    expect(inventory.current).to.be.null;

    ///////////////////////////////////////////////////
    ///// TEST between Inventory objects

    objInv.isHover = true;
    objInv.isClicked = true;
    scene2._update(dt);

    expect(inventory.current).to.be.equal(objInv.name);

    expect(commandBar.showHoverMessage).to.have.been.calledWith(objInv);
    expect(commandBar.messageBox.value).to.be.equal('Use inventoryObj with');

    expect(invCalled).to.be.equal(0); //must not call use of invObj

    objInv.isHover = false;
    objInv.isClicked = false;
    scene2._update(dt);

    // must keep the message on hide
    expect(commandBar.hideHoverMessage).to.have.been.called;
    expect(commandBar.messageBox.value).to.be.equal('Use inventoryObj with');

    objInv2.isHover = true;
    objInv2.isClicked = false;
    scene2._update(dt);

    expect(commandBar.showHoverMessage)
      .to.have.been.calledWith(objInv2);
    expect(commandBar.messageBox.value)
      .to.be.equal('Use inventoryObj with inventoryObj2');

    objInv2.isHover = true;
    objInv2.isClicked = true;
    scene2._update(dt);

    expect(invCalled).to.be.equal(1); // must call second object

    scene2.objects.clear();

  });

});
