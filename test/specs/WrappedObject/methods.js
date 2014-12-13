
var GameObject = require('../../../src/GameObject');
var WrappedObject = require('../../../src/WrappedObject');

var chai = require('chai');
var expect = chai.expect;

describe('methods', function(){

  var wrapped;

  before(function(){
    var obj1 = new GameObject({
      name: 'obj1',
      zIndex: 1,
    });

    var obj2 = new GameObject({
      name: 'obj2',
      zIndex: 2,
    });

    var obj3 = new GameObject({
      name: 'obj3',
      zIndex: 3,
    });

    wrapped = new WrappedObject([obj1,obj2, obj3]);
  });

  describe('#prop', function(){

    it('must allow to get a property of the first object', function(){
      expect(wrapped.prop).to.be.a('function');

      var value = wrapped.prop('zIndex');
      expect(value).to.be.equal(wrapped.at(0).zIndex);
    });

    it('must return undefined if has no objects', function(){
      var wrapped2 = new WrappedObject([]);
      var value = wrapped2.prop('zIndex');
      expect(value).to.be.undefined;
    });

    it('must set a property if a value is passed', function(){
      var result = wrapped.prop('zIndex', 5);

      expect(wrapped.at(0).zIndex).to.be.equal(5);
      expect(wrapped.at(1).zIndex).to.be.equal(5);
      expect(wrapped.at(2).zIndex).to.be.equal(5);

      expect(result).to.be.equal(wrapped);
    });

    it('must do nothing if has no objects', function(){
      var wrapped2 = new WrappedObject([]);
      var result = wrapped2.prop('zIndex', 5);
      expect(result).to.be.equal(wrapped2);
    });

    it('must set all property values if an object is passed', function(){
      var result = wrapped.prop({
        zIndex: 10,
        other: false,
        name: 'test'
      });

      wrapped.each(function(obj){
        expect(obj.zIndex).to.be.equal(10);
        expect(obj.other).to.be.equal(false);
        expect(obj.name).to.be.equal('test');
      });

      expect(result).to.be.equal(wrapped);
    });

    it('must do nothing if no arguments are sent', function(){
      var result = wrapped.prop();
      expect(result).to.be.equal(wrapped);
    });

  });

  describe('#removeProp', function(){

    it('must allow to get a property of the first object', function(){
      expect(wrapped.removeProp).to.be.a('function');

      var result = wrapped.removeProp('other');

      wrapped.each(function(obj){
        expect(obj.other).to.be.undefined;
      });

      expect(result).to.be.equal(wrapped);
    });

    it('must do nothing if no arguments are sent', function(){
      var result = wrapped.removeProp();
      expect(result).to.be.equal(wrapped);
    });

  });

});
