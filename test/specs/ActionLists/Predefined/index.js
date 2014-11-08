
var pac = require('../../../../src/pac');
var expect = require('chai').expect;

describe('Predefined', function(){

  it('must expose pac.actions.Clickable Action', function(){
    expect(pac.actions.Clickable).to.be.a('function');
    expect(pac.actions.Clickable.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Hoverable Action', function(){
    expect(pac.actions.Hoverable).to.be.a('function');
    expect(pac.actions.Hoverable.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Delay Action', function(){
    expect(pac.actions.Delay).to.be.a('function');
    expect(pac.actions.Delay.prototype).to.be.an.instanceof(pac.Action);
  });

  require('./Clickable.js');
  require('./Hoverable.js');
  require('./Delay.js');

});
