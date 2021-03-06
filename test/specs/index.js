var chai = require('chai');
var expect = chai.expect;

describe('PAC', function(){

  describe('Pac initialization', function(){
    var pac = require('../../src');

    it('must contain the version', function(){
      expect(pac.VERSION).to.be.ok;
    });

    it('must contain a DEBUG flag', function(){
      expect(pac.DEBUG).to.be.false;
    });

    //TODO: how to test this?
    it('must have noConflict()', function(){
      expect(pac.noConflict).to.be.a('function');
    });
  });

  describe('Utils', function(){
    it ('must exist a pac._ for utility functions', function(){
      var pac = require('../../src');
      expect(pac._).to.be.a('function');
    });
  });

  require('./base');
  require('./Game');
  require('./Scene');
  require('./Scenes');
  require('./Stage');
  require('./EngineComponents');
  require('./Point.js');
  require('./GameObjects');
  require('./Animations');
  require('./Cache');
  require('./Lists');
  require('./Assets');
  require('./Inputs');
  require('./ActionLists');
  require('./Prefabs');
  require('./WrappedObject');

});
