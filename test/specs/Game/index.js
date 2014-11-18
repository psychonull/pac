
var pac = require('../../../src/pac');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Game', function(){

  it('should expose Game Class', function(){
    expect(pac.Game).to.be.a('function');
  });

  require('./methods.js');
  require('./use.js');
  require('./loadScene.js');
  require('./gameLoop.js');
  require('./fullGame.js');

});
