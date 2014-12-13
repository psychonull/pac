
var WrappedObject = require('../../../src/WrappedObject');
var GameObject = require('../../../src/GameObject');
var List = require('../../../src/List');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('must allow to create with a list of objects', function(){

    var obj1 = new GameObject({
      name: 'obj1'
    });

    var obj2 = new GameObject({
      name: 'obj2'
    });

    var wrapped = new WrappedObject([obj1, obj2]);

    expect(wrapped.length).to.be.equal(2);
  });

  it('must allow to create with a List', function(){

    var obj1 = new GameObject({
      name: 'obj1'
    });

    var obj2 = new GameObject({
      name: 'obj2'
    });

    var list = new List([ obj1, obj2 ]);
    var wrapped = new WrappedObject(list);

    expect(wrapped.length).to.be.equal(2);
  });

});


