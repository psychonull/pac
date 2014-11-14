
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');
var GameObjectList = require('../../../../src/GameObjectList');
var Rectangle = require('../../../../src/Rectangle');
var Point = require('../../../../src/Point');

var chai = require('chai');
var expect = chai.expect;

describe('Drawable', function(){

  it('must expose Drawable Class', function(){
    expect(pac.Drawable).to.be.a('function');
  });

  it('must be a GameObject', function(){
    expect(pac.Drawable.prototype).to.be.an.instanceof(GameObject);
  });

  it('must expose update Method', function(){
    var obj = new pac.Drawable();
    expect(obj.update).to.be.a('function');
  });

  it('must create a Drawable', function(){
    var obj = new pac.Drawable();

    expect(obj.name).to.be.equal('Drawable');
    expect(obj.cid).to.be.an('string');
    expect(obj.position.x).to.be.equal(0);
    expect(obj.position.y).to.be.equal(0);
    expect(obj.zIndex).to.be.equal(0);
  });

  it('must create a Drawable with defaults', function(){
    var obj = new pac.Drawable({
      position: new pac.Point(100, 100)
    });

    expect(obj.position.x).to.be.equal(100);
    expect(obj.position.y).to.be.equal(100);
  });

  it('must allow to create a Drawable with a Layer and zIndex', function(){

    var obj = new pac.Drawable({
      layer: 'background',
      zIndex: 2
    });

    expect(obj.layer).to.be.equal('background');
    expect(obj.zIndex).to.be.equal(2);

    var TestObj = pac.Drawable.extend({
      layer: 'front',
      zIndex: 5
    });

    var obj2 = new TestObj();
    expect(obj2.layer).to.be.equal('front');
    expect(obj2.zIndex).to.be.equal(5);

    var obj3 = new TestObj({
      name: 'TestObj',
      layer: 'middle',
      zIndex: 10
    });

    expect(obj3.name).to.be.equal('TestObj');
    expect(obj3.layer).to.be.equal('middle');
    expect(obj3.zIndex).to.be.equal(10);
  });

  it('must allow to create a Drawable with a shape', function(){

    var objDef = new pac.Drawable();

    expect(objDef.shape).to.be.null;

    var obj = new pac.Drawable({
      shape: new Rectangle(),
    });

    expect(obj.shape.position.x).to.be.equal(0);
    expect(obj.shape.size.width).to.be.equal(50);

  });

  it('must allow to inherit setting defaults', function(){
    var calledInit = false;

    var MyDrawable = pac.Drawable.extend({

      position: { x: 200, y: 200 },

      init: function(options){
        expect(this.position.x).to.be.equal(300);
        expect(options.test).to.be.true;
        calledInit = true;
      }
    });

    var obj = new MyDrawable({
      test: true,
      position: { x: 300, y: 200 }
    });

    expect(calledInit).to.be.true;

    expect(obj.cid).to.be.an('string');
    expect(obj.position.x).to.be.equal(300);
    expect(obj.position.y).to.be.equal(200);
  });

  it('must manage hierarchy', function(){
    var calledInit = false;

    var MyDrawable = pac.Drawable.extend();

    var parentPos = new Point(300, 200);
    var childPos = new Point(50, 50);
    var sumPos = parentPos.add(childPos);

    var parent = new MyDrawable({
      position: parentPos
    });

    var childA = new MyDrawable({
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

    var MyDrawable = pac.Drawable.extend();

    var parentPos = new Point(300, 200);
    var childPos = new Point(50, 50);
    var sumPos = parentPos.add(childPos);

    var parent = new MyDrawable({
      position: parentPos
    });

    var fakeGame = { test1: true };
    var fakeScene = { test2: true };

    parent.game = fakeGame;
    parent.scene = fakeScene;

    var childA = new MyDrawable({
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