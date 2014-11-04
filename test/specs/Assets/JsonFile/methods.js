
var JsonFile = require('../../../../src/JsonFile');
var request = require('request');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

  describe('#load', function(){

      it('must call request with the given url path',
        function(){
          var url = '/test/psycho.json';
          var jsonFile = new JsonFile(url);
          sinon.spy(request, 'get');

          jsonFile.load();

          expect(request.get).to.have.been.calledWith(url);
          request.get.restore();
        }
      );

      it('must load the content and set it to this._data [integration]',
        function(done){
          var url = '/test/psycho.json';
          var jsonFile = new JsonFile(url);

          jsonFile.on('load', function(){
            expect(jsonFile.loaded).to.be.equal(true);
            expect(jsonFile._data).to.be.a('string');
            expect(jsonFile._data).to.be.not.null;
            done();
          });

          expect(jsonFile.loaded).to.be.equal(false);
          expect(jsonFile._data).to.be.null;

          jsonFile.load();
        }
      );

      it('must emit error when not found [integration]',
        function(done){
          var url = '/test/psycho_NULL.json';
          var jsonFile = new JsonFile(url);

          jsonFile.on('error', function(err){
            expect(jsonFile.loaded).to.be.equal(false);
            expect(jsonFile.error.status).to.equal(404);
            expect(jsonFile.error.message).to.match(/not found/i);
            expect(jsonFile._data).to.be.null;
            done();
          });

          expect(jsonFile.loaded).to.be.equal(false);
          expect(jsonFile._data).to.be.null;

          jsonFile.load();
        }
      );

  });

  describe('#raw', function(){

    it('must return an object after loading [integration]', function(done){
      var url = '/test/psycho.json';
      var jsonFile = new JsonFile(url);

      jsonFile.on('load', function(){
        var raw = jsonFile.raw();
        expect(raw).to.be.an('object');
        expect(raw.psycho).to.be.true;
        done();
      });

      expect(jsonFile.raw()).to.be.null;

      jsonFile.load();
    });

    it('must throw an error if invalid json is in _data', function(){
      var url = '/test/psycho.json';
      var jsonFile = new JsonFile(url);

      jsonFile._data = '{invalidjson jojojo}';

      expect(function(){
        jsonFile.raw();
      }).to.throw(/unable to parse JSON/i);

    });


  });

});
