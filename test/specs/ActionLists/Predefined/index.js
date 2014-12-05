
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

  it('must expose Command Actions', function(){
    expect(pac.actions.Commander).to.be.a('function');
    expect(pac.actions.Command).to.be.a('function');
    expect(pac.actions.InventoryCommand).to.be.a('function');
    expect(pac.actions.WalkerCommand).to.be.a('function');

    expect(pac.actions.Commander.prototype).to.be.an.instanceof(pac.Action);
    expect(pac.actions.Command.prototype).to.be.an.instanceof(pac.Action);
    expect(pac.actions.InventoryCommand.prototype)
      .to.be.an.instanceof(pac.Action);
    expect(pac.actions.WalkerCommand.prototype)
      .to.be.an.instanceof(pac.Action);
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

  it('must expose pac.actions.Animate Action', function(){
    expect(pac.actions.Animate).to.be.a('function');
    expect(pac.actions.Animate.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Execute Action', function(){
    expect(pac.actions.Execute).to.be.a('function');
    expect(pac.actions.Execute.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.Tween Action', function(){
    expect(pac.actions.Tween).to.be.a('function');
    expect(pac.actions.Tween.prototype).to.be.an.instanceof(pac.Action);
  });

  it('must expose pac.actions.AutoZIndex Action', function(){
    expect(pac.actions.AutoZIndex).to.be.a('function');
    expect(pac.actions.AutoZIndex.prototype).to.be.an.instanceof(pac.Action);
  });

  require('./Clickable.js');
  require('./Hoverable.js');
  require('./Delay.js');
  require('./Commander.js');
  require('./Command.js');
  require('./InventoryCommand.js');
  require('./WalkerCommand.js');
  require('./Walker.js');
  require('./WalkTo.js');
  require('./Speaker.js');
  require('./Speak.js');
  require('./Dialoguer.js');
  require('./Animate.js');
  require('./Execute.js');
  require('./Tween.js');
  require('./AutoZIndex.js');

});
