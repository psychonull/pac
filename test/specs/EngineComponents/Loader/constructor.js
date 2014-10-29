
var Loader = require('../../../../src/Loader');
var Cache = require('../../../../src/Cache');
var Texture = require('../../../../src/Texture');
var _ = require('../../../../src/utils');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Constructor', function(){

  it('must set the game instance', function(){
    var fakeGame = {},
      loader = new Loader(fakeGame);
    expect(loader.game).to.equal(fakeGame);
  });

  it('must inject a Cache instance into the game', function(){
    var fakeGame = {},
      loader = new Loader(fakeGame);
    expect(fakeGame.cache).to.be.ok;
    expect(fakeGame.cache).to.be.an.instanceof(Cache);
  });

  it('must not inject a new cache instance if there is one already', function(){
    var fakeCache = {},
      fakeGame = { cache: fakeCache },
      loader = new Loader(fakeGame);
    expect(fakeGame.cache).to.equal(fakeCache);
  });

  it('must init a cache for each resourceType accepted', function(){

    var MyLoader = Loader.extend({},{
      ResourceTypes: { unicorns: Texture, cats: Texture }
    });

    var loader = new MyLoader({});

    expect(loader.unicorns).to.be.an.instanceof(Cache);
    expect(loader.cats).to.be.an.instanceof(Cache);

  });

  it('can receive an object of key:filename and add the resources', function(){
    var addResourcesSpy = sinon.spy(Loader.prototype, 'addResources');

    var files = {
      player1: 'player1.png',
      player2: 'player2.png'
    };
    var loader = new Loader({}, files);

    expect(addResourcesSpy).to.have.been.calledWith(files);

    Loader.prototype.addResources.restore();
  });

  it('can identify filetype from file extension');

  it('must map filetype to Class (eg. image -> Texture)');

  it('must map filetype to Class (eg. image -> Texture)');

  it('can receive a dictionary of key:obj and set it to files');

  it('can receive a dictionary of key:group:obj and setup the groups');

});
