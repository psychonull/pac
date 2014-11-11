
var _ = require('../../../../src/utils');
var BitmapFont = require('../../../../src/BitmapFont');
var Texture = require('../../../../src/Texture');
var JsonFile = require('../../../../src/JsonFile');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Constructor', function(){


  it('must throw an error if no texture and definition', function(){

    expect(function(){
      var font = new BitmapFont();
    }).to.throw(/Missing/i);

    expect(function(){
      var font = new BitmapFont({
        texture: 'font.png'
      });
    }).to.throw(/Missing/i);

    expect(function(){
      var font = new BitmapFont({
        definition: 'font.json'
      });
    }).to.throw(/Missing/i);

    var font = new BitmapFont({
      texture: 'font.png',
      definition: 'font.json'
    });

    expect(font).to.be.an.instanceof(BitmapFont);

  });

  it('must call parent constructor', function(){
    sinon.spy(BitmapFont.__super__, 'init');
    var options = {
      texture: 'font.png',
      definition: 'font.json'
    };
    var font = new BitmapFont(options);

    expect(BitmapFont.__super__.init).to.have.been.calledWith(options);
    expect(font.url).to.be.undefined;

    BitmapFont.__super__.init.restore();
  });

  it('must instantiate a Texture and Definition Json', function(){
    var options = {
      texture: 'font.png',
      definition: 'font.json'
    };

    var font = new BitmapFont(options);

    expect(font.textureAsset).to.be.an.instanceof(Texture);
    expect(font.definitionAsset).to.be.an.instanceof(JsonFile);
    expect(font.textureAsset.url).to.equal(options.texture);
    expect(font.definitionAsset.url).to.equal(options.definition);
  });

  it('must instantiate a Texture and Definition XML');

  it('must subscribe to load and error events', function(){
    var options = {
      texture: 'font.png',
      definition: 'font.json'
    };
    sinon.spy(Texture.prototype, 'on');
    sinon.spy(JsonFile.prototype, 'on');

    var font = new BitmapFont(options);

    expect(font.textureAsset.on).to.have.been.calledWith('load');
    expect(font.textureAsset.on).to.have.been.calledWith('error');
    expect(font.definitionAsset.on).to.have.been.calledWith('load');
    expect(font.definitionAsset.on).to.have.been.calledWith('error');

    Texture.prototype.on.restore();
    JsonFile.prototype.on.restore();
  });

});
