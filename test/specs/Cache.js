
var Cache = require('../../src/Cache');
var Emitter = require('../../src/Emitter');

var GameObject = require('../../src/GameObject');

var chai = require('chai');
var expect = chai.expect;

describe('Cache', function(){

  it('Must inherit from Emitter', function(){
    expect(Cache.prototype).to.be.an.instanceof(Emitter);
  });

  describe('Constructor', function(){

    it('Must start with no elements', function(){
      var cache = new Cache();
      expect(cache.length).to.equal(0);
    });

    it('Can be initialized with data', function(){
      var cache = new Cache({ 
        player: 'wowowow', 
        pointer: 'wesa' 
      });

      expect(cache.length).to.equal(2);
      expect(cache.get('player')).to.equal('wowowow');
    });

    it('Can be initialized with a validation', function(){

      var cache = new Cache(null, function greaterThan0(val){
        return val > 0;
      });

      expect(cache.length).to.equal(0);

      expect(function(){
        cache.add('test', -1);
      }).to.throw(/validation error/i);
    });

    it('Must throw an error if data does not pass the validation', function(){

      expect(function(){
        var cache = new Cache({randomName: 100}, function only42(val){
          return val === 42;
        });
      }).to.throw(/validation error/i);

    });

  });

  describe('Methods', function(){

    describe('add()', function(){

      it('Must add an element to the cache', function(){
        var cache = new Cache();
        cache.add('test', {});
        expect(cache.length).to.equal(1);
      });

      it('Must throw an error when trying to add element with same name',
        function(){
          var cache = new Cache();
          cache.add('test', {});

          expect(function(){
            cache.add('test', {});
          }).to.throw(/duplicate key/i);

        }
      );

      it('Must add an element to the cache by its own cid', function(){
        var cache = new Cache();
        cache.add({ cid: '123', prop: 'hi' });

        expect(cache.length).to.equal(1);
        expect(cache.get('123').cid).to.be.equal('123');
        expect(cache.get('123').prop).to.be.equal('hi');
      });

      it('Must throw an error when trying to add element with same cid',
        function(){
          var cache = new Cache();
          cache.add({ cid: '123', prop: 'hi' });

          expect(function(){
            cache.add({ cid: '123', prop: 'hi' });
          }).to.throw(/duplicate key/i);

        }
      );

      it('Must add an array to the cache by its own cids', function(){
        var cache = new Cache();

        cache.add([
          { cid: '123', prop: 'hi1' },
          { cid: '124', prop: 'hi2' }
        ]);

        expect(cache.length).to.equal(2);
        expect(cache.get('123').prop).to.be.equal('hi1');
        expect(cache.get('124').prop).to.be.equal('hi2');
      });

      it('Must throw an Error if a type is defined and dont match', function(){
        var TestObject = GameObject.extend();

        var TestCache = Cache.extend({
          childType: GameObject
        });

        var cache = new TestCache();
        
        cache.add(new TestObject());

        expect(cache.length).to.equal(1);

        expect(function(){
          cache.add({ cid: '123', prop: 'hi' });
        }).to.throw(/invalid child type/i);

      });

    });

    describe('get()', function(){

      it('Must return an element from cache', function(){
        var cache = new Cache();
        var fakeObj = {};
        cache.add('test', fakeObj);
        expect(cache.get('test')).to.equal(fakeObj);
      });

      it('Must return null if no element', function(){
        var cache = new Cache();
        expect(cache.get('testtests')).to.be.null;
      });

    });

    describe('remove()', function(){

      it('Must remove the element from cache and return it', function(){
        var cache = new Cache();
        var fakeObj = {};
        cache.add('test', fakeObj);

        expect(cache.remove('test')).to.equal(fakeObj);
        expect(cache.get('test')).to.be.null;
        expect(cache.length).to.equal(0);
      });

    });

    describe('hasKey()', function(){

      it('must return true if the cache has the key', function(){
        var cache = new Cache();
        cache.add('m', 1);
        expect(cache.hasKey('m')).to.be.true;
      });

      it('must return false if the cache does NOT have the key', function(){
        var cache = new Cache();
        expect(cache.hasKey('1337')).to.be.false;
      });

    });

    describe('validate() and setValidation()', function(){

      it('must be an everything is valid funcion by default', function(){
        var cache = new Cache();
        expect(cache.validate(1)).to.be.true;
      });

      it('must allow to change the validation function', function(){
        var cache = new Cache();
        var onlyNumbers = function(val){
          return typeof val === 'number';
        };
        cache.setValidation(onlyNumbers);
        expect(cache.validate(1)).to.be.true;
        expect(function(){
          cache.validate('1');
        }).to.throw(/validation error/i);
      });

      it('must throw custom error msg if string returned', function(){
        var cache = new Cache();

        var onlyNumbers = function(val){
          if (typeof val !== 'number'){
            return 'only numbers accepted';
          }
          return true;
        };

        cache.setValidation(onlyNumbers);
        expect(cache.validate(1)).to.be.true;

        expect(function(){
          cache.validate('1');
        }).to.throw(/only numbers accepted/i);

      });
      it('must validate on add()', function(){

        var cache = new Cache();

        var onlyNumbers = function(val){
          if (typeof val !== 'number'){
            return 'only numbers accepted';
          }
          return true;
        };

        cache.setValidation(onlyNumbers);
        cache.add('test', 1);

        expect(function(){
          cache.add('another-test', {});
        }).to.throw(/only numbers accepted/i);

      });
      it('must throw error if passing a non-function to setValidation()',
        function(){
          var cache = new Cache();

          expect(function(){
            cache.setValidation(1);
          }).to.throw(/Invalid Argument/i);

        }
      );
    });

    describe('addGroup()', function(){

      it('A group must be a nested cache instance', function(){

        var cache = new Cache();
        expect(cache.groups.length).to.equal(0);
        cache.addGroup('test');
        expect(cache.groups.length).to.equal(1);
      });

      it('Must throw an error when trying to add group with same name',
        function(){
          var cache = new Cache();
          expect(cache.addGroup('sounds')).to.be.ok;

          expect(function(){
            cache.addGroup('sounds', {});
          }).to.throw(/duplicate key/i);

        }
      );
      it('Must init group with data and validationFn if passed', function(){
        var cache = new Cache();

        cache.addGroup('numbers', {one: 1}, function(val){
          return typeof val === 'number';
        });

        var numbers = cache.getGroup('numbers');
        expect(numbers.length).to.equal(1);

        expect(function(){
          numbers.add('one', 2);
        }).to.throw(/duplicate key/i);

        expect(function(){
          numbers.add('two', '2');
        }).to.throw(/validation error/i);

      });
    });

    describe('getGroup()', function(){

      it('Must return null if no group with that name', function(){
        var cache = new Cache();
        expect(cache.getGroup('images')).to.be.null;
      });

      it('return the group if found',
        function(){
          var cache = new Cache();
          var vid = cache.addGroup('videos');
          expect(cache.getGroup('videos')).to.equal(vid);
        }
      );
    });

    describe('hasGroup()', function(){

      it('Must return false if no group with that name', function(){
        var cache = new Cache();
        expect(cache.hasGroup('images')).to.be.false;
      });

      it('Must return true if group found',
        function(){
          var cache = new Cache();
          var vid = cache.addGroup('videos');
          expect(cache.hasGroup('videos')).to.be.true;
        }
      );
    });

  });

});
