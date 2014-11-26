
var pac = require('../../../src/pac');
var expect = require('chai').expect;

describe('Prefabs', function(){

  it('must expose pac.prefabs.CommandBar', function(){
    expect(pac.prefabs.CommandBar).to.be.a('function');
    expect(pac.prefabs.CommandBar.prototype).to.be.an.instanceof(pac.Rectangle);
  });

  it('must expose pac.prefabs.Command', function(){
    expect(pac.prefabs.Command).to.be.a('function');
    expect(pac.prefabs.Command.prototype).to.be.an.instanceof(pac.Text);
  });

  it('must expose pac.prefabs.Inventory', function(){
    expect(pac.prefabs.Inventory).to.be.a('function');
    expect(pac.prefabs.Inventory.prototype).to.be.an.instanceof(pac.Rectangle);
  });

  it('must expose pac.prefabs.WalkableArea', function(){
    expect(pac.prefabs.WalkableArea).to.be.a('function');
    expect(pac.prefabs.WalkableArea.prototype)
      .to.be.an.instanceof(pac.GameObject);
  });

  it('must expose pac.prefabs.DialogueOptionsBar', function(){
    expect(pac.prefabs.DialogueOptionsBar).to.be.a('function');
    expect(pac.prefabs.DialogueOptionsBar.prototype)
      .to.be.an.instanceof(pac.GameObject);
  });

  require('./Command');
  require('./CommandBar');
  require('./Inventory');
  require('./WalkableArea');
  require('./DialogueManager');
  require('./DialogueOptionsBar');

});
