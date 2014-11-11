
var Loader = require('../../../../src/Loader');
var Texture = require('../../../../src/Texture');
var JsonFile = require('../../../../src/JsonFile');
var BitmapFont = require('../../../../src/BitmapFont');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Statics', function(){

  describe('Types', function(){

    it('must include type mappings', function(){
      expect(Loader.ResourceTypes.images).to.equal(Texture);
      expect(Loader.ResourceTypes.json).to.equal(JsonFile);
      expect(Loader.ResourceTypes.bitmapFont).to.equal(BitmapFont);
    });

  });

  describe('#ResolveFileType', function(){

    it('must return a fileType based on a fileName', function(){
      expect(Loader.ResolveFileType('hi.jpg')).to.equal('images');
      expect(Loader.ResolveFileType('hi23nci9__.jpeg')).to.equal('images');
      expect(Loader.ResolveFileType('./assets/img/hi.png')).to.equal('images');
      expect(Loader.ResolveFileType('./config/scenes.json')).to.equal('json');
    });

    it('must throw an error if the filetype is unknown', function(){

      expect(function(){
        Loader.ResolveFileType('hi.jpgxxxxx');
      }).to.throw(/file type not supported/ig);

    });
  });

});
