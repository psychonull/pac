
var _ = require('../../../src/utils');
var Point = require('../../../src/Point');
var GameObjectList = require('../../../src/GameObjectList');

var Inventory = require('../../../src/prefabs/Inventory');
var Rectangle = require('../../../src/Rectangle');
var Sprite = require('../../../src/Sprite');

var Monkey = Sprite.extend({
  texture: 'test'
});

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var inventoryOpts = {

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

};

var positions = [
  [{ x: 10, y: 5 }, { x: 220, y: 5 }],
  [{ x: 10, y: 50 }, { x: 220, y: 50 }]
];

function checkPositions(inventory, obj, pos){
  var offset = inventoryOpts.style.position;

  expect(obj.localPosition.x).to.be.equal(pos.x + offset.x);
  expect(obj.localPosition.y).to.be.equal(pos.y + offset.y);

  var cPosX = pos.x + inventory.position.x + offset.x;
  var cPosY = pos.y + inventory.position.y + offset.y;
  expect(obj.position.x).to.be.equal(cPosX);
  expect(obj.position.y).to.be.equal(cPosY);
}

describe('Inventory', function(){

  it('must allow to create a Inventory', function(){

    var inventory = new Inventory(_.clone(inventoryOpts, true));

    expect(inventory.name).to.be.equal('Inventory');

    expect(inventory.position.x).to.be.equal(200);
    expect(inventory.position.y).to.be.equal(200);

    expect(inventory.size.width).to.be.equal(500);
    expect(inventory.size.height).to.be.equal(100);

    expect(inventory.current).to.be.null;
    expect(inventory.children).to.be.instanceof(GameObjectList);
    expect(inventory.children.length).to.be.equal(inventory.maxItems);

    expect(inventory.style.itemsPerRow).to.be.equal(2);

    var cSize = inventory.style.size;
    expect(cSize.width).to.be.equal(200);
    expect(cSize.height).to.be.equal(40);

    var cMargin = inventory.style.margin;
    expect(cMargin.x).to.be.equal(10);
    expect(cMargin.y).to.be.equal(5);

    expect(inventory.children.at(0)).to.be.instanceof(Rectangle);

    checkPositions(inventory, inventory.children.at(0), positions[0][0]);
    checkPositions(inventory, inventory.children.at(1), positions[0][1]);
    checkPositions(inventory, inventory.children.at(2), positions[1][0]);
    checkPositions(inventory, inventory.children.at(3), positions[1][1]);

  });

  describe('#add', function(){

    it('must add any GameObject into the inventory', function(){
      var inventory = new Inventory(_.clone(inventoryOpts, true));
      expect(inventory.add).to.be.a('function');

      var monkey1 = new Monkey({
        name: 'monkey1',
        positions: new Point(550, 300),
        size: { width: 600, height: 500 }
      });

      inventory.add(monkey1);

      expect(inventory.children.length).to.be.equal(inventory.maxItems+1);

      var m = inventory.children.at(inventory.maxItems);

      expect(m.isInInventory).to.be.true;
      expect(m).to.be.equal(monkey1);
      checkPositions(inventory, m, positions[0][0]);

      expect(m.size.width).to.be.equal(inventory.style.size.width);
      expect(m.size.height).to.be.equal(inventory.style.size.height);

      // must create a shape of the inventory item size
      expect(m.shape).to.be.an.instanceof(Rectangle);
      expect(m.shape.position.x).to.be.equal(0);
      expect(m.shape.position.y).to.be.equal(0);
      expect(m.shape.size.width).to.be.equal(inventory.style.size.width);
      expect(m.shape.size.height).to.be.equal(inventory.style.size.height);

      // add other object

      var monkey2 = new Monkey({
        name: 'monkey2',
        positions: new Point(550, 300),
        size: { width: 200, height: 30 }
      });

      inventory.add(monkey2);
      expect(inventory.children.length).to.be.equal(inventory.maxItems+2);
      m = inventory.children.at(inventory.maxItems+1);
      expect(m).to.be.equal(monkey2);
      checkPositions(inventory, m, positions[0][1]);

    });

  });

  describe('#has', function(){

    it('must search and return if an object is in the inventory', function(){
      var inventory = new Inventory(_.clone(inventoryOpts, true));
      expect(inventory.has).to.be.a('function');

      var monkey1 = new Monkey({
        name: 'monkey1',
        positions: new Point(550, 300),
        size: { width: 600, height: 500 }
      });

      inventory.add(monkey1);

      expect(inventory.has('monkey1')).to.be.true;
      expect(inventory.has('monkeyX')).to.be.false;
    });

  });

  describe('#remove', function(){

    it('must search and remove an object from the inventory', function(){
      var inventory = new Inventory(_.clone(inventoryOpts, true));
      expect(inventory.remove).to.be.a('function');

      var monkey1 = new Monkey({
        name: 'monkey1',
        positions: new Point(550, 300),
        size: { width: 600, height: 500 }
      });

      var monkey2 = new Monkey({
        name: 'monkey2',
        positions: new Point(550, 300),
        size: { width: 600, height: 500 }
      });

      var monkey3 = new Monkey({
        name: 'monkey3',
        positions: new Point(550, 300),
        size: { width: 600, height: 500 }
      });

      inventory.add(monkey1);
      inventory.add(monkey2);
      inventory.add(monkey3);

      expect(inventory.has('monkey1')).to.be.true;
      expect(inventory.has('monkey2')).to.be.true;
      expect(inventory.has('monkey3')).to.be.true;

      expect(monkey1.isInInventory).to.be.true;

      inventory.remove('monkey1');
      expect(monkey1.isInInventory).to.be.false;

      expect(inventory.has('monkey1')).to.be.false;
      expect(inventory.has('monkey2')).to.be.true;
      expect(inventory.has('monkey3')).to.be.true;

      // check re position of the items after the remove
      expect(inventory.children.length).to.be.equal(inventory.maxItems+2);
      var m = inventory.children.at(inventory.maxItems);
      expect(m).to.be.equal(monkey2);
      checkPositions(inventory, m, positions[0][0]);

      m = inventory.children.at(inventory.maxItems+1);
      expect(m).to.be.equal(monkey3);
      checkPositions(inventory, m, positions[0][1]);
    });

  });


});