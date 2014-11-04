var chai = require('chai');
var expect = chai.expect;

describe('PAC', function(){

  describe('Pac initialization', function(){
    var pac = require('../../src');

    it('must contain the version', function(){
      expect(pac.VERSION).to.be.ok;
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

  require('./Game/index.js');

  require('./Scene/index.js');

  require('./Scenes/index.js');

  require('./EngineComponents/index.js');

  require('./Point.js');
  require('./GameObjects/index.js');
  require('./Animations');
  require('./Cache');

  require('./Lists');

  require('./Assets');
  require('./ActionLists');

});
