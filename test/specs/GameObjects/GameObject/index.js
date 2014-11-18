
var pac = require('../../../../src/pac');
var Emitter = require('../../../../src/Emitter');

var ActionList = require('../../../../src/ActionList');
var Action = require('../../../../src/Action');

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

});