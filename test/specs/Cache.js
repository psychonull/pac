
var Cache = require('../../src/Cache');
var Emitter = require('../../src/Emitter');

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
    });

  });

});
