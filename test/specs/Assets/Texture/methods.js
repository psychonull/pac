
var Texture = require('../../../../src/Texture');
var List = require('../../../../src/List');
var MapList = require('../../../../src/MapList');
var JsonFile = require('../../../../src/JsonFile');
var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Methods', function(){

  describe('#load', function(){

    it('must expose a load method', function(){
      var texture = new Texture('some.png');
      expect(texture.load).to.be.a('function');
    });

    it('must load the image and fire an event load', function(done){
      var url = 'psycho.png';
      var texture = new Texture(url);

      var loadEmitted = 0;
      var errorEmitted = 0;

      texture.on('load', function(){
        loadEmitted++;
        expect(texture.loaded).to.be.equal(true);

        expect(loadEmitted).to.be.equal(1);
        expect(errorEmitted).to.be.equal(0);
        done();
      });

      texture.on('error', function(){
        errorEmitted++;
      });

      expect(texture.loaded).to.be.equal(false);
      expect(texture.image).to.be.instanceof(Image);
      expect(texture.url).to.be.equal(url);

      expect(loadEmitted).to.be.equal(0);
      expect(errorEmitted).to.be.equal(0);

      texture.load();
    });

    it('must try to load and fire an event error event', function(done){
      var url = '404.png';
      var texture = new Texture(url);

      var loadEmit = 0;
      texture.on('load', function(){
        loadEmit++;
        expect(false).to.be.true;
      });

      texture.on('error', function(){
        expect(loadEmit).to.be.equal(0);
        expect(texture.loaded).to.be.equal(false);
        done();
      });

      expect(texture.loaded).to.be.equal(false);
      expect(texture.image).to.be.instanceof(Image);
      expect(texture.url).to.be.equal(url);

      texture.load();
    });

  });

  describe('#setFrames', function(){

    it('must set a List of frames array passed', function(){
      var url = 'psycho.png';
      var texture = new Texture(url);
      var frame0 = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      },
        frame1 = {
          x: 10,
          y: 0,
          width: 10,
          height: 10
        };

      texture.setFrames([frame0, frame1]);

      expect(texture.frames).to.be.an.instanceof(List);
      expect(texture.frames.length).to.equal(2);
      expect(texture.frames.get(0)).to.equal(frame0);
      expect(texture.frames.get(1)).to.equal(frame1);
    });

    it('must set a MapList of frames, object passed', function(){
      var url = 'psycho.png';
      var texture = new Texture(url);
      var frameGood = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      },
      frameBad = {
        x: 10,
        y: 0,
        width: 10,
        height: 10
      },
      frames = {
        good: frameGood,
        bad: frameBad
      };

      texture.setFrames(frames);

      expect(texture.frames).to.be.an.instanceof(MapList);
      expect(texture.frames.length).to.equal(2);
      expect(texture.frames.get('good')).to.equal(frameGood);
      expect(texture.frames.get('bad')).to.equal(frameBad);
    });

  });

  describe('#setAtlas', function(){
    it('must only accept JsonFiles', function(){
      var texture = new Texture('conga.png');
      expect(function(){
        texture.setAtlas({ on: 'iwannabeaneventemitter' });
      }).to.throw(/invalid atlas type: object/i);
    });

    it('must set the atlas propery and subscribe to the load event', function(){
      var texture = new Texture('conga.png');
      var atlas = new JsonFile('conga.json');
      sinon.spy(atlas, 'on');
      expect(texture.atlas).to.be.null;

      texture.setAtlas(atlas);

      expect(texture.atlas).to.equal(atlas);
      expect(atlas.on).to.have.been.calledWith('load');
    });

    it('must set the frames without subscribing to load if atlas is loaded',
      function(){
        var texture = new Texture('conga.png');
        var atlas = new JsonFile('conga.json');
        var theFrames = {};
        atlas.loaded = true;
        sinon.stub(atlas, 'raw').returns({frames: theFrames});
        sinon.spy(atlas, 'on');
        sinon.stub(texture, 'setFrames');

        expect(texture.atlas).to.be.null;

        texture.setAtlas(atlas);

        expect(texture.atlas).to.equal(atlas);
        expect(atlas.on).to.not.have.been.called;
        expect(texture.setFrames).to.have.been.calledWith(theFrames);
      }
    );

    it('must set the frames after atlas emits the "load" event',
      function(done){
        var texture = new Texture('conga.png');
        var atlas = new JsonFile('conga.json');
        var theFrames = {};
        sinon.stub(atlas, 'raw').returns({frames: theFrames});
        sinon.spy(atlas, 'on');
        sinon.stub(texture, 'setFrames');

        expect(texture.atlas).to.be.null;

        texture.setAtlas(atlas);

        expect(texture.atlas).to.equal(atlas);
        expect(atlas.on).to.have.been.calledWith('load');

        atlas.on('load', function(){
          expect(texture.setFrames).to.have.been.calledWith(theFrames);
          done();
        });
        atlas.emit('load');
      }
    );

    it('the texture must be loaded=false if the atlas is not loaded',
      function(){
        var texture = new Texture('conga.png');
        var atlas = new JsonFile('conga.json');
        sinon.spy(atlas, 'on');
        sinon.stub(atlas, 'raw').returns({frames:{}});
        texture.onload();

        expect(texture.atlas).to.be.null;
        expect(texture.loaded).to.be.true;

        texture.setAtlas(atlas);

        expect(texture.atlas).to.equal(atlas);
        expect(atlas.on).to.have.been.calledWith('load');

        expect(atlas.loaded).to.be.false;
        expect(texture.loaded).to.be.false;


        var texture2 = new Texture('conga.png');
        atlas.loaded = true;
        texture2.onload();
        texture2.setAtlas(atlas);

        expect(texture2.loaded).to.be.true;

        var texture3 = new Texture('conga.png');
        atlas.loaded = true;
        texture3.setAtlas(atlas);

        expect(texture3.loaded).to.be.false;
      }
    );


  });

  describe('#raw', function(){

    it('must return null if the image is not loaded', function(){
      var texture = new Texture('psycho.png');
      expect(texture.raw()).to.be.null;
    });

    it('must return the image if loaded', function(done){
      var texture = new Texture('psycho.png');
      texture.on('load', function(){
        expect(texture.raw()).to.be.equal(texture.image);
        done();
      });
      texture.load();
    });

  });

  describe('#toBase64', function(){

    it('must return the image as a base 64 data string');

  });

});
