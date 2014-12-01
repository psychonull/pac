
var pac = require('../../../../src/pac');
var Emitter = require('../../../../src/Emitter');

var Rectangle = require('../../../../src/Rectangle');
var Point = require('../../../../src/Point');

var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

var GameObjectList = require('../../../../src/GameObjectList');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var TestAction = Action.extend({

  onStart: function() { },
  onEnd: function() { },

  update: function(dt) { },

});

describe('GameObject', function(){

  it('must expose GameObject Class', function(){
    expect(pac.GameObject).to.be.a('function');
  });

  it('must be an Emitter', function(){
    expect(pac.GameObject.prototype).to.be.an.instanceof(Emitter);
  });

  it('must have a default name and allow to set one', function(){
    var obj = new pac.GameObject();
    expect(obj.name).to.be.equal('GameObject');

    obj = new pac.GameObject({
      name: 'Crazy Object'
    });
    expect(obj.name).to.be.equal('Crazy Object');

    var ObjectAux = pac.GameObject.extend({
      name: 'Aux'
    });

    obj = new ObjectAux();
    expect(obj.name).to.be.equal('Aux');

    obj = new ObjectAux({
      name: 'Aux New'
    });
    expect(obj.name).to.be.equal('Aux New');

    expect(obj.active).to.be.equal(true);

    expect(obj.cid).to.be.an('string');
    expect(obj.position.x).to.be.equal(0);
    expect(obj.position.y).to.be.equal(0);
    expect(obj.zIndex).to.be.equal(0);
    expect(obj.visible).to.be.true;
  });

  it('must expose update Method', function(){
    var obj = new pac.GameObject();
    expect(obj.update).to.be.a('function');

    expect(obj.cid).to.be.a('string');
    expect(obj.cid.length).to.be.greaterThan(0);

    expect(obj.actions).to.be.null;
  });

  it('must expose onEnterScene Method', function(){
    var obj = new pac.GameObject();
    expect(obj.onEnterScene).to.be.a('function');
  });

  it('must allow to create with a Layer and zIndex', function(){

    var obj = new pac.GameObject({
      layer: 'background',
      zIndex: 2
    });

    expect(obj.layer).to.be.equal('background');
    expect(obj.zIndex).to.be.equal(2);

    var TestObj = pac.GameObject.extend({
      layer: 'front',
      zIndex: 5
    });

    var obj2 = new TestObj();
    expect(obj2.layer).to.be.equal('front');
    expect(obj2.zIndex).to.be.equal(5);

    var obj3 = new TestObj({
      name: 'TestObj',
      layer: 'middle',
      zIndex: 10,
      active: false,
      visible: false
    });

    expect(obj3.name).to.be.equal('TestObj');
    expect(obj3.layer).to.be.equal('middle');
    expect(obj3.zIndex).to.be.equal(10);

    expect(obj3.active).to.be.equal(false);
    expect(obj3.visible).to.be.equal(false);
  });

  it('must allow to create with a shape', function(){

    var objDef = new pac.GameObject();

    expect(objDef.shape).to.be.null;

    var obj = new pac.GameObject({
      shape: new Rectangle(),
    });

    expect(obj.shape.position.x).to.be.equal(0);
    expect(obj.shape.size.width).to.be.equal(50);

  });

  it('must allow to inherit setting defaults', function(){
    var calledInit = false;

    var MyGameObject = pac.GameObject.extend({

      position: { x: 200, y: 200 },

      init: function(options){
        expect(this.position.x).to.be.equal(300);
        expect(options.test).to.be.true;
        calledInit = true;
      }
    });

    var obj = new MyGameObject({
      test: true,
      position: { x: 300, y: 200 }
    });

    expect(calledInit).to.be.true;

    expect(obj.cid).to.be.an('string');
    expect(obj.position.x).to.be.equal(300);
    expect(obj.position.y).to.be.equal(200);
  });

  describe('Actions', function(){

    it('must allow to set and initialize Actions', function(){

      var SomeAction = new TestAction();

      var obj = new pac.GameObject({
        actions: [ SomeAction ]
      });

      expect(obj.actions).to.be.an.instanceof(ActionList);
      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.owner).to.be.equal(obj);

      var Prefab = pac.GameObject.extend({
        actions: [ SomeAction ]
      });

      obj = new Prefab();

      expect(obj.actions).to.be.an.instanceof(ActionList);
      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.owner).to.be.equal(obj);

    });

    it('must allow to set and initialize Actions by an ActionList', function(){

      var SomeAction = new TestAction();
      var actList = new ActionList([ SomeAction ]);

      var obj = new pac.GameObject({
        actions: actList
      });

      expect(obj.actions).to.be.an.instanceof(ActionList);
      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.owner).to.be.equal(obj);

      var Prefab = pac.GameObject.extend({
        actions: actList
      });

      obj = new Prefab();

      expect(obj.actions).to.be.an.instanceof(ActionList);
      expect(obj.actions.length).to.be.equal(1);
      expect(obj.actions.owner).to.be.equal(obj);

    });

    it('must expose an updateActions method', function(){

      var someAction = new TestAction();
      var actList = new ActionList([ someAction ]);

      var obj = new pac.GameObject({
        actions: actList
      });

      expect(obj.updateActions).to.be.a('function');

      sinon.spy(actList, 'update');
      sinon.spy(someAction, 'update');

      var dt = 0.16;
      obj.updateActions(dt);

      expect(actList.update).to.have.been.calledWith(dt);
      expect(someAction.update).to.have.been.calledWith(dt);

      actList.update.restore();
      someAction.update.restore();

    });

    it('must not use updateActions method if object has no actions', function(){

      expect(function(){
        var obj = new pac.GameObject();
        obj.updateActions(0.16);
      }).to.not.throw();

    });

  });

  describe('Hierarchy', function(){

    it('must manage hierarchy', function(){
      var calledInit = false;

      var MyGameObject = pac.GameObject.extend();

      var parentPos = new Point(300, 200);
      var childPos = new Point(50, 50);
      var sumPos = parentPos.add(childPos);

      var parent = new MyGameObject({
        position: parentPos
      });

      var childA = new MyGameObject({
        position: childPos
      });

      expect(parent.parent).to.be.null;
      expect(parent.children).to.be.instanceof(GameObjectList);

      expect(childA.localPosition).to.be.null;
      parent.children.add(childA);

      expect(childA.parent).to.be.equal(parent);
      expect(childA.position.x).to.be.equal(sumPos.x);
      expect(childA.position.y).to.be.equal(sumPos.y);

      expect(childA.localPosition.x).to.be.equal(childPos.x);
      expect(childA.localPosition.y).to.be.equal(childPos.y);

    });

    it('must manage update hierarchy position', function(){
      var calledInit = false;

      var MyGameObject = pac.GameObject.extend();

      var parentPos = new Point(300, 200);
      var childPos = new Point(50, 50);
      var sumPos = parentPos.add(childPos);

      var parent = new MyGameObject({
        position: parentPos
      });

      var fakeGame = { test1: true };
      var fakeScene = { test2: true };

      parent.game = fakeGame;
      parent.scene = fakeScene;

      var childA = new MyGameObject({
        position: childPos
      });

      expect(childA.game).to.be.undefined;
      expect(childA.scene).to.be.undefined;

      childA.updateHierarchy();
      expect(childA.position.x).to.be.equal(childPos.x);
      expect(childA.position.y).to.be.equal(childPos.y);

      // add children
      parent.children.add(childA);

      expect(childA.game).to.be.equal(fakeGame);
      expect(childA.scene).to.be.equal(fakeScene);

      expect(childA.position.x).to.be.equal(sumPos.x);
      expect(childA.position.y).to.be.equal(sumPos.y);

      // change parent position
      parent.position = parent.position.add(new Point(10, 20));

      childA.updateHierarchy();

      expect(childA.localPosition.x).to.be.equal(childPos.x);
      expect(childA.localPosition.y).to.be.equal(childPos.y);

      expect(childA.position.x).to.be.equal(sumPos.x+10);
      expect(childA.position.y).to.be.equal(sumPos.y+20);

    });

  });

});