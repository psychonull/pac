
var pac = require('../../../../src/pac');
var Loader = require('../../../../src/Loader');
var Texture = require('../../../../src/Texture');
var Cache = require('../../../../src/Cache');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('#getResourceTypes', function(){

  it('should return the keys of Loader.ResourceTypes', function(){

    var MyLoader = Loader.extend({}, {
      ResourceTypes: { unicorns: String, dogs: String }
    });

    var loader = new MyLoader({});

    expect(loader.getResourceTypes()).to.eql(['unicorns', 'dogs']);

  });

});

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

  describe('with options as second param', function(){

    it('options must allow to override filetype detection', function(){
      var FakeTextureLike = sinon.spy();
      var MyLoader = Loader.extend({}, {
        ResourceTypes: { unicorns: FakeTextureLike, images: Texture }
      });

      sinon.spy(MyLoader, 'ResolveFileType');

      var loader = new MyLoader({});
      var unicornsAdd = sinon.spy(loader.unicorns, 'add');
      var imagesAdd = sinon.spy(loader.images, 'add');
      var filepath = './assets/unicorns/stay.free';

      var result = loader.addResource('stay', {
        path: filepath,
        type: 'unicorns'
      });

      expect(MyLoader.ResolveFileType).to.not.have.been.called;
      expect(FakeTextureLike).to.have.been.calledWith(filepath);

      expect(result).to.be.an.instanceof(FakeTextureLike);
      expect(unicornsAdd).to.have.been.calledWith('stay', result);
      expect(imagesAdd).to.not.have.been.called;
    });

    it('must throw error when filetype mapping not found', function(){

      var loader = new Loader({});
      var filepath = './assets/unicorns/stay.free';

      expect(function(){
        var result = loader.addResource('stay', {
          path: filepath,
          type: 'fantasyType'
        });
      }).to.throw(/No type mapping for: fantasyType/);

    });

  });

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

describe('#getResources', function(){

  it('Should return an empty array if no resources', function(){
    var loader = new Loader({});
    expect(loader.getResources()).to.have.length(0);
  });

  it('Should return an array of resources of every kind', function(){
    var MyLoader = Loader.extend({}, {
      ResourceTypes: { cats: Object, dogs: Object }
    });
    var loader = new MyLoader({});

    // hook straight into cats.add just for mocking purposes
    loader.cats.add('catOne', 1);
    loader.cats.add('catTwo', 2);
    loader.dogs.add('dog', 'dog');
    loader.dogs.add('dogTwo', 'wow wow!');

    expect(loader.getResources()).to.have.length(4);
    expect(loader.getResources()).to.include(1);
    expect(loader.getResources()).to.include(2);
    expect(loader.getResources()).to.include('dog');
    expect(loader.getResources()).to.include('wow wow!');

  });

});

describe('#load', function(){

  it('must emit the start event', function(done){
    var loader = new Loader({});
    loader.on('start', function(){
      done();
    });
    loader.load();
  });

  var makeResource = function(onFn){
    var x = {
      load: function(){},
      on: onFn || function(event, cb){
        //setTimeout(cb, 5);
      }
    };
    sinon.spy(x, 'load');
    sinon.spy(x, 'on');
    return x;
  };

  it('must call load() on every resource returned by getResources()',
    function(){

      var resources = [makeResource(), makeResource()];
      var loader = new Loader({});
      sinon.stub(loader, 'getResources').returns(resources);

      loader.load();

      expect(loader.getResources).to.have.been.called.once;
      expect(resources[0].load).to.have.been.called.once;
      expect(resources[1].load).to.have.been.called.once;
    }
  );

  it('must subscribe to the "load" event on every resource', function(){
    var resources = [makeResource(), makeResource()];
    var loader = new Loader({});
    sinon.stub(loader, 'getResources').returns(resources);

    loader.load();

    expect(loader.getResources).to.have.been.called.once;
    expect(resources[0].on).to.have.been.calledWith('load');
    expect(resources[1].on).to.have.been.calledWith('load');
  });

  it('must emit a progress event when one asset is loaded', function(done){
    var onFn = function(event, cb){
      // simulate 15ms load (?)
      setTimeout(cb, 15);
    };
    var resources = [makeResource(onFn), makeResource()];
    var loader = new Loader({});
    sinon.stub(loader, 'getResources').returns(resources);

    loader.on('progress', function(progress){
      expect(progress).to.equal(0.5);
      done();
    });

    loader.load();

  });

  it('must emit a complete event and not progress when all loaded',
    function(done){
      var onFn = function(event, cb){
        // simulate 15ms load (?)
        setTimeout(cb, 15);
      };
      var resources = [makeResource(onFn), makeResource(onFn)];
      var loader = new Loader({});
      sinon.stub(loader, 'getResources').returns(resources);
      sinon.spy(loader, 'emit');

      loader.on('complete', function(){
        expect(loader.emit.firstCall).to.have.been.calledWith('start');
        expect(loader.emit.secondCall).to.have.been.calledWith('progress', 0.5);
        expect(loader.emit.thirdCall).to.have.been.calledWith('complete');
        done();
      });

      loader.load();

    }
  );

  it('must handle asset loading errors');

  it('must set the game cache on completion [integration test]', function(done){
    var FakeType = function(url){
      this.url = url;
      this.on = function(event, cb){
        var that = this;
        setTimeout(function(){
          that.loaded = true;
          cb();
        }, 15);
      };
      this.load = function(){};
    };

    var MyLoader = Loader.extend({}, {
      ResourceTypes: { needles: FakeType },
      ResolveFileType: sinon.stub().returns('needles')
    });
    var fakeGame = {};
    var filesToLoad = {
      one: 'firstFakeNeedle.need',
      two: 'secondFakeNeedle.need'
    };
    var loader = new MyLoader(fakeGame, filesToLoad);

    loader.on('complete', function(){
      expect(fakeGame.cache.needles.length).to.equal(2);
      done();
    });

    loader.load();

  });

  it('can receive a group name and start loading that group only');

});

describe('#overwriteGameCache', function(){

  it('must overwrite every cache.resourceType collection', function(){
    var MyLoader = Loader.extend({}, {
      ResourceTypes: { cats: Object }
    });
    var fakeGame = {
      cache: {
        cats: new Cache({ miau: 1 })
      }
    };
    var loader = new MyLoader(fakeGame);

    expect(fakeGame.cache.cats.length).to.equal(1);

    loader.overwriteGameCache();

    expect(fakeGame.cache.cats.length).to.equal(0);

  });

  it('must put only loaded resources into the game.cache', function(){
    var MyLoader = Loader.extend({}, {
      ResourceTypes: { needles: String, pins: String }
    });
    var fakeGame = {};
    var loader = new MyLoader(fakeGame);

    // hook straight into needles and pins .add just for mocking purposes
    loader.needles.add('viva', { loaded: true });
    loader.needles.add('noviva', { loaded: false });
    loader.pins.add('viva', { loaded: true });

    loader.overwriteGameCache();

    expect(fakeGame.cache.needles.length).to.equal(1);
    expect(fakeGame.cache.needles.get('viva')).to.exist;
    expect(fakeGame.cache.needles.get('noviva')).to.be.null;
    expect(fakeGame.cache.pins.length).to.equal(1);
    expect(fakeGame.cache.needles.get('viva')).to.exist;

  });

});
