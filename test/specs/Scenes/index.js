
var pac = require('../../../src/pac');
var Scenes = require('../../../src/Scenes');
var MapList = require('../../../src/MapList');

var Scene = require('../../../src/Scene');

var expect = require('chai').expect;

describe('Scenes', function(){

  it('must NOT expose Scenes Class', function(){
    expect(pac.Scenes).to.be.equal(undefined);
  });

  it('must be a MapList', function(){
    expect(Scenes.prototype).to.be.an.instanceof(MapList);
  });

  it('must have default Values', function(){
    var fakeGame = { something: true };
    var scenes = new Scenes(null, { game: fakeGame });

    expect(scenes.childType).to.be.equal(Scene);

    expect(scenes.current).to.be.null;
    expect(scenes.length).to.be.equal(0);
    expect(scenes.game).to.be.equal(fakeGame);
  });

  require('./methods');

});
