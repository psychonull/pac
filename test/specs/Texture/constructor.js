
var pac = require('../../../src/pac');
var Texture = require('../../../src/Texture');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('must create a Texture from an URL');

  it('must create a Texture from an URL emitting a load event');
  it('must create a Texture from an URL emitting an error event');

  it('must throw an error if URL is CORS');

  it('must create a Texture from an String base64');
  it('must throw a parse error if base64 is wrong on creating');

  it('must create a Texture from an Image');
  it('must create a Texture from an Image emitting a load event');
  it('must create a Texture from an Image emitting an error event');  

});