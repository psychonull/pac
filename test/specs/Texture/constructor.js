
var pac = require('../../../src/pac');
var Texture = require('../../../src/Texture');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('must create a Texture from an URL', function(){
    var url = 'psycho.png';
    var texture = new Texture(url);

    expect(texture.loaded).to.be.equal(false);
    expect(texture.image).to.be.instanceof(Image);
    expect(texture.url).to.be.equal(url);
  });

  it('must throw an error if no arguments sent', function(){

    expect(function(){
      var texture = new Texture();
    }).to.throw('Expected an URL, image object or a base64');

  });

  it('must create a Texture from an String base64');
  it('must throw a parse error if base64 is wrong on creating');

  it('must create a Texture from an Image');
  it('must create a Texture from an Image emitting a load event');
  it('must create a Texture from an Image emitting an error event');  

});