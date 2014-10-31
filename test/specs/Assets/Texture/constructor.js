
var pac = require('../../../../src/pac');
var Texture = require('../../../../src/Texture');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Constructor', function(){

  it('must call parent constructor', function(){
    sinon.spy(Texture.__super__, 'init');

    var texture = new Texture('url');

    expect(Texture.__super__.init).to.have.been.calledWith('url');
    expect(texture.url).to.be.equal('url');

    Texture.__super__.init.restore();
  });

  it('must create a Texture from an URL', function(){
    var url = 'psycho.png';
    var texture = new Texture(url);

    expect(texture.loaded).to.be.equal(false);
    expect(texture.image).to.be.instanceof(Image);
  });

  it('must throw an error if no url passed', function(){

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
