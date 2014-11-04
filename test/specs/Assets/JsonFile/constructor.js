
var JsonFile = require('../../../../src/JsonFile');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Constructor', function(){

  it('must call parent constructor', function(){
    sinon.spy(JsonFile.__super__, 'init');

    var jsonFile = new JsonFile('url');

    expect(JsonFile.__super__.init).to.have.been.calledWith('url');
    expect(jsonFile.url).to.be.equal('url');

    JsonFile.__super__.init.restore();
  });

  it('must throw an error if no url passed', function(){

    expect(function(){
      var texture = new JsonFile();
    }).to.throw('Expected an URL');

  });
});
