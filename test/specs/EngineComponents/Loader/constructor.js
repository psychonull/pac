
var Loader = require('../../../../src/Loader');
var Cache = require('../../../../src/Cache');

var chai = require('chai');
var expect = chai.expect;

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

  it('can receive a dictionary of key:filename and set it to files');

  it('can identify filetype from file extension');

  it('must map filetype to Class (eg. image -> Texture)');

  it('can receive a dictionary of key:obj and set it to files');

  it('can receive a dictionary of key:group:obj and setup the groups');

});
