
var pac = require('../../../../src/pac');
var Loader = require('../../../../src/Loader');
var Texture = require('../../../../src/Texture');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('#addResource', function(){

  it('should support to add an image (NoStubs - integration)',
    function(){
      var loader = new Loader({});
      var filepath = './assets/img/char.png';

      var result = loader.addResource('char', filepath);

      expect(result).to.be.an.instanceof(Texture);
      expect(loader.images.get('char')).to.equal(result);
    }
  );

  it('must throw error when duplicated key for same resourceType (NoStubs)',
    function(){
      var loader = new Loader({});
      var filepath = './assets/img/char.png';

      var result = loader.addResource('char', filepath);

      expect(function(){
        loader.addResource('char', filepath);
      }).to.throw(/duplicate/i);
    }
  );

  it('must allow same key for different resourceTypes',
    function(){
      var FakeTextureLike = sinon.spy();
      var fakeResolver = sinon.stub();
      fakeResolver.onCall(0).returns('unicorns');
      fakeResolver.onCall(1).returns('dogs');

      var MyLoader = Loader.extend({}, {
        ResourceTypes: { unicorns: FakeTextureLike, dogs: FakeTextureLike },
        ResolveFileType: fakeResolver
      });

      var loader = new MyLoader({});

      var filepath = './assets/img/char.png';

      var aUnicorn = loader.addResource('char', 'a.unicorn');
      var aDog = loader.addResource('char', 'a.dog');

      expect(loader.unicorns.get('char')).to.equal(aUnicorn);
      expect(loader.dogs.get('char')).to.equal(aDog);

    }
  );

  it('should create an instance of the type and add it to the collection',
    function(){
      var FakeTextureLike = sinon.spy();
      var MyLoader = Loader.extend({}, {
        ResourceTypes: { unicorns: FakeTextureLike },
        ResolveFileType: sinon.stub().returns('unicorns')
      });

      var loader = new MyLoader({});
      var unicornsAdd = sinon.spy(loader.unicorns, 'add');
      var filepath = './assets/unicorns/stay.free';

      var result = loader.addResource('stay', filepath);

      expect(MyLoader.ResolveFileType).to.have.been.calledWith(filepath);
      expect(FakeTextureLike).to.have.been.calledWith(filepath);

      expect(result).to.be.an.instanceof(FakeTextureLike);
      expect(unicornsAdd).to.have.been.calledWith('stay', result);
    }
  );

  it('must throw error if type does not map to a Constructor in ResourceTypes',
    function(){
      var MyLoader = Loader.extend({}, {
        ResourceTypes: { cats: Object },
        ResolveFileType: sinon.stub().returns('unicorns')
      });
      var loader = new MyLoader({});

      expect(function(){
        loader.addResource('stay', 'fakepath.exe');
      }).to.throw(/No type mapping for: unicorns/i);

      expect(MyLoader.ResolveFileType).to.have.been.calledWith('fakepath.exe');
    }
  );

});

describe('#addResources', function(){

  it('should iterate the object passed as parameter and call addResource()',
    function(){
      var addResourceStub = sinon.stub();
      var MyLoader = Loader.extend({
        addResource: addResourceStub
      }, {});

      var files = {
        player1: 'player1.png',
        player2: 'player2.png'
      };

      var loader = new MyLoader({}, files);

      expect(addResourceStub).to.have.been.calledWith('player1', 'player1.png');
      expect(addResourceStub).to.have.been.calledWith('player2', 'player2.png');
    }
  );

});

describe('#load', function(){

  it('must emit the start event', function(done){
    var loader = new Loader({});
    loader.on('start', function(){
      done();
    });
    loader.load();
  });

  it('must start loading the assets');
  it('can receive a group name and start loading that group only');

});
