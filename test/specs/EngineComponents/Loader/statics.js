
var Loader = require('../../../../src/Loader');
var Texture = require('../../../../src/Texture');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Statics', function(){

  describe('Types', function(){
    it('must include type mappings', function(){
      expect(Loader.Types.image).to.equal(Texture);
    });
  });

  describe('ResolveFileType()', function(){
    it('must return a fileType based on a fileName', function(){
      expect(Loader.ResolveFileType('hi.jpg')).to.equal('image');
      expect(Loader.ResolveFileType('./assets/img/hi.png')).to.equal('image');
    });
  });

});
