var BitmapFont = require('../../../../src/BitmapFont');
var Texture = require('../../../../src/Texture');
var JsonFile = require('../../../../src/JsonFile');
var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){
  var options = {
    texture: 'font.png',
    definition: 'font.json'
  };

  describe('#load', function(){

    it('must call load on the Texture and Definition assets', function(){
      var bitmapFont = new BitmapFont(options);
      sinon.stub(bitmapFont.textureAsset, 'load');
      sinon.stub(bitmapFont.definitionAsset, 'load');


      bitmapFont.load();

      expect(bitmapFont.textureAsset.load).to.have.been.called;
      expect(bitmapFont.definitionAsset.load).to.have.been.called;
    });

    it('must emit load after the two files load', function(done){
      var bitmapFont = new BitmapFont(options);

      expect(bitmapFont.textureAsset.loaded).to.be.false;
      expect(bitmapFont.definitionAsset.loaded).to.be.false;

      bitmapFont.on('load', function(){
        expect(bitmapFont.textureAsset.loaded).to.be.true;
        expect(bitmapFont.definitionAsset.loaded).to.be.true;
        done();
      });

      setTimeout(function(){
        // call onload directly only for testing
        bitmapFont.textureAsset.onload();
        setTimeout(function(){
          bitmapFont.definitionAsset.onload();
        }, 10);
      }, 10);
    });

    it('must emit error if an asset fails loading', function(done){
      var bitmapFont = new BitmapFont(options);
      var err = { msg: 'fake error xD' };

      expect(bitmapFont.textureAsset.error).to.be.null;
      expect(bitmapFont.definitionAsset.error).to.be.null;

      bitmapFont.on('error', function(e){
        expect(bitmapFont.textureAsset.loaded).to.be.false;
        expect(bitmapFont.definitionAsset.loaded).to.be.false;
        expect(bitmapFont.definitionAsset.error).to.be.null;
        expect(bitmapFont.textureAsset.error).to.equal(err);
        expect(e).to.equal(err);
        done();
      });

      setTimeout(function(){
        // call onerror directly only for testing
        bitmapFont.textureAsset.onerror(err);

      }, 10);

    });

  });

  describe('#raw', function(){

    it('must return an object with texture and definition raw', function(){
      var bitmapFont = new BitmapFont(options);
      sinon.stub(bitmapFont.textureAsset, 'raw').returns('a');
      sinon.stub(bitmapFont.definitionAsset, 'raw').returns('b');

      var raw = bitmapFont.raw();

      expect(raw.texture).to.equal('a');
      expect(raw.definition).to.equal('b');
    });

  });

});
