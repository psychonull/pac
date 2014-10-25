
var pac = require('../../../src/pac');
var Scene = require('../../../src/Scene');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Monkey = pac.Drawable.extend({

  name: '',

  init: function(options){
    this.name = options && options.name || '';
  },

  update: function() { },

});

describe('#add', function(){

  it('must exist add method', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    expect(scene.add).to.be.a('function');
  });

  it('must allow to add a GameObject', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var monkey = new Monkey();

    scene.add(monkey);

    expect(scene.objects).to.be.an('array');
    expect(scene.objects.length).to.be.equal(1);
    expect(scene.objects[0]).to.be.instanceof(Monkey);
  });

  it('must throw an error if not inherit from GameObject', function(){

    expect(function(){
      
      var scene = new Scene({
        name: 'test',
        size: { width: 200, height: 300 }
      });

      scene.add(new pac.Point());

    }).to.throw('Only pac.GameObjects are allowed to add into an Scene');

  });

  it('must allow to add an array of pac.GameObjects', function(){
    var scene = new Scene({
      name: 'test',
      size: { width: 200, height: 300 }
    });

    var monkeys = [
      new Monkey({ name: 'Chubaka' }), 
      new Monkey({ name: 'Pepito' })
    ];

    scene.add(monkeys);

    expect(scene.objects).to.be.an('array');
    expect(scene.objects.length).to.be.equal(2);

    expect(scene.objects[0].name).to.be.equal('Chubaka');
    expect(scene.objects[1].name).to.be.equal('Pepito');
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
        new pac.Point()
      ];

      scene.add(monkeys);

    }).to.throw('Only pac.GameObjects are allowed to add into an Scene');

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

    scene.add([monkey1, monkey2]);

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