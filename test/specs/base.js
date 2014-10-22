var pac = require('../../src/pac');

var TestBase = pac.Base.extend({

  init: false,
  start: function(){
    this.init = true;
  },

});

var TestBaseEmitter = pac.Emitter.extend({

  initA: false,
  start: function(){
    this.initA = true;
  },

  triggerEvent: function(){
    this.emit('an:event', 1);
  }

});

var TestBaseEmitterB = TestBaseEmitter.extend({

  initB: false,
  start: function(){
    this.initB = true;
  },

  triggerEvent: function(){
    this.emit('an:event', 1);
  }

});

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Base', function(){

  it('should exists Base Class', function(){
    expect(pac.Base).to.be.a('function');
  });

  it('should call start constructor', function(){
    var test = new TestBase();
    expect(test.init).to.be.equal(true);
  });

});

describe('Emitter', function(){

  it('should call start constructor', function(){
    var test = new TestBaseEmitter();
    expect(test.initA).to.be.equal(true);
  });

  it('should allow to add and fire events', function(){
    var test = new TestBaseEmitter();
    expect(test.initA).to.be.equal(true);

    var eventsThrown = false;

    test.on('an:event', function(data){
      expect(data).to.be.equal(1);
      eventsThrown++;
    });

    test.triggerEvent();

    expect(eventsThrown).to.be.equal(1);

  });

  it('should fire events in the current instance only', function(){
    var testParent = new TestBaseEmitter();
    var eventsThrown = 0;

    testParent.on('an:event', function(data){
      eventsThrown++;
    });

    var test = new TestBaseEmitterB();
    expect(test.initA).to.be.equal(false);
    expect(test.initB).to.be.equal(true);

    test.on('an:event', function(data){
      expect(data).to.be.equal(1);
      eventsThrown++;
    });

    test.triggerEvent();

    expect(eventsThrown).to.be.equal(1);
  });

});
