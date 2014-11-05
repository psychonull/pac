var Asset = require('../../../src/Asset');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);


describe('Asset', function(){

  it('should NOT expose Asset Class', function(){
    expect(pac.Asset).to.be.equal(undefined);
  });

  describe('Constructor', function(){

    it('must set url from constructor', function(){
      var url = 'psycho.png';
      var asset = new Asset(url);

      expect(asset.url).to.be.equal(url);

      var otherAsset = new Asset({
        url: url
      });

      expect(otherAsset.url).to.be.equal(url);

      var assetWithoutUrl = new Asset();

      expect(assetWithoutUrl.url).to.be.null;

      var assetWithPath = new Asset({
        path: url
      });

      expect(assetWithPath.url).to.be.equal(url);
    });

  });

  describe('Methods', function(){
    var asset;

    beforeEach(function(){
      asset = new Asset('a.midi');
      sinon.stub(asset, 'emit');
    });

    describe('#onload', function(){

      it('should set the loaded property', function(){
        expect(asset.loaded).to.be.false;

        asset.onload();

        expect(asset.loaded).to.be.true;
      });

      it('should emit the "load" event', function(){
        asset.onload();

        expect(asset.emit).to.have.been.calledOnce;
      });

    });

    describe('#onerror', function(){
      it('loaded should be false and set error', function(){
        expect(asset.error).to.be.null;

        asset.onerror();

        expect(asset.loaded).to.be.false;
        expect(asset.error).to.be.true;
      });

      it('loaded should set error passed as parameter', function(){
        var error = new Error();
        expect(asset.error).to.be.null;

        asset.onerror(error);

        expect(asset.error).to.be.equal(error);
      });

      it('should emit the "error" event with the error', function(){
        var error = new Error();

        asset.onerror(error);

        expect(asset.emit).to.have.been.calledWith('error', error);
      });

    });

    describe('#load', function(){
      it('should throw not implemented error', function(){
        var asset = new Asset();
        expect(function(){
          asset.load();
        }).to.throw(/not implemented/i);
      });
    });

    describe('#raw', function(){
      it('should throw not implemented error', function(){
        var asset = new Asset();
        expect(function(){
          asset.raw();
        }).to.throw(/not implemented/i);
      });
    });

  });
});
