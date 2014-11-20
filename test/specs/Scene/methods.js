
var Point = require('../../../src/Point');
var GameObject = require('../../../src/GameObject');
var Drawable = require('../../../src/Drawable');
var Scene = require('../../../src/Scene');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Monkey = Drawable.extend({

  title: '',

  init: function(options){
    this.title = options && options.title || '';
  },

  update: function() { },

});

describe('#addObject', function(){

  it('must exist addObject method', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene.addObject).to.be.a('function');
  });

  it('must allow to addObject a GameObject', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var fakeGame = { test: true };
    scene.game = fakeGame;

    var monkey = new Monkey();

    scene.addObject(monkey);

    expect(scene.objects.length).to.be.equal(1);
    expect(scene.objects.get(monkey.cid)).to.be.instanceof(Monkey);
    expect(monkey.scene).to.be.equal(scene);
    expect(monkey.game).to.be.equal(fakeGame);
  });

  it('must throw an error if not inherit from GameObject', function(){

    expect(function(){

      var scene = new Scene({
        name: 'test',
        size: { width: 200, height: 300 }
      });

      scene.addObject(new Point());

    }).to.throw('invalid child type');

  });

  it('must allow to addObject an array of GameObjects', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var monkeys = [
      new Monkey({ title: 'Chubaka' }),
      new Monkey({ title: 'Pepito' })
    ];

    scene.addObject(monkeys);

    expect(scene.objects.length).to.be.equal(2);

    expect(scene.objects.at(0).title).to.be.equal('Chubaka');
    expect(scene.objects.at(1).title).to.be.equal('Pepito');
  });

  it('must throw an error if not inherit from GameObject with an array',
  function(){

    expect(function(){

      var scene = new Scene({
        name: 'test',
        size: { width: 200, height: 300 }
      });

      var monkeys = [
        new Monkey({ title: 'Chubaka' }),
        new Point()
      ];

      scene.addObject(monkeys);

    }).to.throw('invalid child type');

  });

});

describe('#findOne', function(){

  it('must return the first object found by a query or name', function(){

    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene.findOne).to.be.a('function');

    var monkeys = [
      new Monkey({ name: 'Chubaka', title: 'ChubakaTitle' }),
      new Monkey({ title: 'Pepito' })
    ];

    scene.addObject(monkeys);

    var found = scene.findOne('Chubaka');
    expect(found).to.be.equal(monkeys[0]);

    found = scene.findOne('Drawable');
    expect(found).to.be.equal(monkeys[1]);

    found = scene.findOne({ title: 'ChubakaTitle' });
    expect(found).to.be.equal(monkeys[0]);

    found = scene.findOne('Chubakita');
    expect(found).to.be.undefined;
  });

});

describe('#find', function(){

  it('must return a list of objects found by a query or name', function(){

    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene.find).to.be.a('function');

    var monkeys = [
      new Monkey({ name: 'Chubaka', title: 'ChubakaTitle' }),
      new Monkey({ title: 'Pepito' })
    ];

    scene.addObject(monkeys);

    var found = scene.find('Chubaka');
    expect(found.length).to.be.equal(1);

    found = scene.find('Drawable');
    expect(found.length).to.be.equal(1);

    found = scene.find({ title: 'ChubakaTitle' });
    expect(found.length).to.be.equal(1);

    found = scene.find({ title: 'Chubakita' });
    expect(found.length).to.be.equal(0);
  });

});

describe('#_update', function(){

  it('must exist _update method', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene._update).to.be.a('function');
  });

  it('must call the implemented update method', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    sinon.spy(scene, 'update');
    scene._update(0.16);

    expect(scene.update).to.have.been.calledOnce;
    expect(scene.update).to.have.been.calledWith(0.16);

    scene.update.restore();
  });

  it('must call _update for every contained GameObject', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var monkey1 = new Monkey({ title: 'Chubaka' });
    var monkey2 = new Monkey({ title: 'Pepito' });
    var monkeyChild = new Monkey({ title: 'Little Chubaka' });
    var gm = new GameObject();

    monkey1.children.add(monkeyChild);
    sinon.spy(monkeyChild, 'update');
    sinon.spy(monkeyChild, 'updateHierarchy');

    // scene objects
    sinon.spy(monkey1, 'update');
    sinon.spy(monkey2, 'update');

    sinon.spy(monkey1, 'updateHierarchy');
    sinon.spy(monkey2, 'updateHierarchy');

    scene.addObject([monkey1, monkey2, gm]);

    var dt = 0.16;
    scene._update(dt);

    expect(monkey1.update).to.have.been.calledOnce;
    expect(monkey2.update).to.have.been.calledOnce;

    expect(monkey1.updateHierarchy).to.have.been.calledOnce;
    expect(monkey2.updateHierarchy).to.have.been.calledOnce;

    expect(monkey1.update).to.have.been.calledWith(dt);
    expect(monkey2.update).to.have.been.calledWith(dt);

    expect(monkeyChild.update).to.have.been.calledOnce;
    expect(monkeyChild.updateHierarchy).to.have.been.calledOnce;

    monkey1.update.restore();
    monkey2.update.restore();
  });

});