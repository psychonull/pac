
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

  it('must expose pac.actions.Command Action', function(){
    expect(pac.actions.Command).to.be.a('function');
    expect(pac.actions.Command.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Walker Action', function(){
    expect(pac.actions.Walker).to.be.a('function');
    expect(pac.actions.Walker.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.WalkTo Action', function(){
    expect(pac.actions.WalkTo).to.be.a('function');
    expect(pac.actions.WalkTo.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Speaker Action', function(){
    expect(pac.actions.Speaker).to.be.a('function');
    expect(pac.actions.Speaker.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Dialoguer Action', function(){
    expect(pac.actions.Dialoguer).to.be.a('function');
    expect(pac.actions.Dialoguer.prototype).to.be.an.instanceof(pac.Action);
  });

  require('./Clickable.js');
  require('./Hoverable.js');
  require('./Delay.js');
  require('./Command.js');
  require('./Walker.js');
  require('./WalkTo.js');
  require('./Speaker.js');
  require('./Speak.js');
  require('./Dialoguer.js');

});
