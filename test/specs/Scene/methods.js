
var Point = require('../../../src/Point');
var Drawable = require('../../../src/Drawable');
var Scene = require('../../../src/Scene');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Monkey = Drawable.extend({

  name: '',

  init: function(options){
    this.name = options && options.name || '';
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

    var monkey = new Monkey();

    scene.addObject(monkey);

    expect(scene.objects.length).to.be.equal(1);
    expect(scene.objects.get(monkey.cid)).to.be.instanceof(Monkey);
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
      new Monkey({ name: 'Chubaka' }), 
      new Monkey({ name: 'Pepito' })
    ];

    scene.addObject(monkeys);

    expect(scene.objects.length).to.be.equal(2);

    expect(scene.objects.at(0).name).to.be.equal('Chubaka');
    expect(scene.objects.at(1).name).to.be.equal('Pepito');
  });

  it('must throw an error if not inherit from GameObject with an array', 
  function(){

    expect(function(){
      
      var scene = new Scene({
        name: 'test',
        size: { width: 200, height: 300 }
      });

      var monkeys = [
        new Monkey({ name: 'Chubaka' }), 
        new Point()
      ];

      scene.addObject(monkeys);

    }).to.throw('invalid child type');

  });

});

describe('#update', function(){

  it('must exist update method', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene.update).to.be.a('function');
  });

  it('must call update for every contained GameObject', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var monkey1 = new Monkey({ name: 'Chubaka' });
    var monkey2 = new Monkey({ name: 'Pepito' });

    sinon.spy(monkey1, 'update');
    sinon.spy(monkey2, 'update');

    scene.addObject([monkey1, monkey2]);

    var dt = 0.16;
    scene.update(dt);

    expect(monkey1.update).to.have.been.calledOnce;
    expect(monkey2.update).to.have.been.calledOnce;

    expect(monkey1.update).to.have.been.calledWith(dt);
    expect(monkey2.update).to.have.been.calledWith(dt);

    monkey1.update.restore();
    monkey2.update.restore();
  });

});