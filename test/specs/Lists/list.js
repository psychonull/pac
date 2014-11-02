
var List = require('../../../src/List');
var Emitter = require('../../../src/Emitter');

var chai = require('chai');
var expect = chai.expect;

var GameObject = require('../../../src/GameObject');

var TestItem = GameObject.extend();

var TestList = List.extend({
  childType: TestItem
});

describe('List', function(){

  it('must inherit from Emitter', function(){
    expect(List.prototype).to.be.an.instanceof(Emitter);
  });

  describe('Constructor', function(){

    it('must allow to create an empty list', function(){
      var list = new List();
      expect(list.length).to.be.equal(0);
      expect(list._items.length).to.be.equal(0);
    });

    it('must allow to create from an array', function(){
      var arr = [ new TestItem(), new TestItem() ];

      var list = new List(arr);

      expect(list.length).to.be.equal(2);
      expect(list._items.length).to.be.equal(2);
    });

    it('must throw an error first argument is not an array', function(){
      
      expect(function(){
        var list = new TestList({});
      }).to.throw('invalid argument, expected an array');

    });

    it('must throw an error if childType is wrong', function(){
      var arr = [ new GameObject(), new GameObject() ];
      var arr2 = [ new TestItem(), new TestItem() ];

      expect(function(){
        var list = new TestList(arr);
      }).to.throw('invalid child type');

      expect(function(){
        var list = new TestList(arr2);
      }).to.not.throw('invalid child type');

    });

  });

  describe('Methods', function(){

    describe('#add', function(){

      it('must allow to add an Item', function(){
        var list = new TestList();
        list.add(new TestItem());

        expect(list.length).to.be.equal(1);
        expect(list._items.length).to.be.equal(1);
      });

      it('must fire an add event with the item added', function(){
        var list = new TestList();
        
        var item = new TestItem();

        var emitted = 0;
        list.on('add', function(_item){
          emitted++;
          expect(_item.cid).to.be.equal(item.cid);
        });

        list.add(item);
        expect(emitted).to.be.equal(1);
      });

      it('must throw an error if Item is not allowed type', function(){
        var list = new TestList();
        
        expect(function(){
          list.add(new GameObject());
        }).to.throw('invalid child type');

      });

      it('must allow to add an array of Items', function(){
        var arr = [ new TestItem(), new TestItem() ];
        var list = new TestList();

        var emitted = 0;
        list.on('add', function(){
          emitted++;
        });

        list.add(arr);

        expect(list.length).to.be.equal(2);
        expect(list._items.length).to.be.equal(2);
        expect(emitted).to.be.equal(2);

        expect(function(){
          list.add([new TestItem(), new GameObject()]);
        }).to.throw('invalid child type');

      });

      it('must allow to add from another List', function(){
        var listFrom = new TestList([ new TestItem(), new TestItem() ]);
        var list = new TestList();

        var emitted = 0;
        list.on('add', function(){
          emitted++;
        });

        list.add(listFrom);

        expect(list.length).to.be.equal(2);
        expect(list._items.length).to.be.equal(2);
        expect(emitted).to.be.equal(2);
      });

      it('must do nothing if the item already exists', function(){
        var list = new TestList();
        var item = new TestItem();

        var emitted = 0;
        list.on('add', function(_item){
          emitted++;
          expect(_item.cid).to.be.equal(item.cid);
        });

        list.add(item);
        expect(list.length).to.be.equal(1);
        expect(emitted).to.be.equal(1);

        // second time for same item
        list.add(item);
        expect(list.length).to.be.equal(1);
        expect(emitted).to.be.equal(1);
      });

    });

    describe('#get', function(){

      it('must allow to get an Item by cid', function(){
        var list = new TestList();
        var searchItem = new TestItem();

        list.add([ new TestItem(), new TestItem(), searchItem, new TestItem()]);

        var found = list.get(searchItem.cid);
        expect(found).to.not.be.undefined;
        expect(found.cid).to.be.equal(searchItem.cid);

        found = list.get('xxx');
        expect(found).to.be.undefined;
      });

    });

    describe('#at', function(){

      it('must allow to get an Item by index', function(){
        var list = new TestList();
        var searchItem = new TestItem();

        list.add([ new TestItem(), new TestItem(), searchItem, new TestItem()]);

        var found = list.at(2);
        expect(found).to.not.be.undefined;
        expect(found.cid).to.be.equal(searchItem.cid);

        found = list.at(1000);
        expect(found).to.be.undefined;
      });

    });

    describe('#remove', function(){

      it('must allow to remove an Item by cid', function(){
        var list = new TestList();
        var removeItem = new TestItem();
        var cid = removeItem.cid;

        list.add([ new TestItem(), new TestItem(), removeItem, new TestItem()]);

        var len = list.length;

        var emitted = 0;
        list.on('remove', function(item){
          emitted++;
          expect(item.cid).to.be.equal(cid);
        });

        list.remove(cid);
        
        expect(list.length).to.be.equal(len-1);
        expect(emitted).to.be.equal(1);

        // do it again

        var currLen = list.length;

        list.remove(cid);

        expect(list.length).to.be.equal(currLen);
        expect(emitted).to.be.equal(1);        
      });

      it('must allow to remove an Item by instance', function(){
        var list = new TestList();
        var removeItem = new TestItem();

        list.add([ new TestItem(), new TestItem(), removeItem, new TestItem()]);

        var len = list.length;

        var emitted = 0;
        list.on('remove', function(item){
          emitted++;
          expect(item.cid).to.be.equal(removeItem.cid);
        });

        list.remove(removeItem);
        
        expect(list.length).to.be.equal(len-1);
        expect(emitted).to.be.equal(1);
      });

    });

    describe('#clear', function(){

      it('must allow to clear the list and emit event clear', function(){
        var list = new TestList();
        list.add([ new TestItem(), new TestItem()]);

        expect(list.length).to.be.equal(2);
        expect(list._items.length).to.be.equal(2);

        var emitted = 0;
        list.on('clear', function(){
          emitted++;
        });

        list.clear();

        expect(list.length).to.be.equal(0);
        expect(list._items.length).to.be.equal(0);
        expect(emitted).to.be.equal(1);   
      });

    });

    describe('#each', function(){

      it('must allow iterate through the list', function(){
        var list = new TestList();
        var arr = [new TestItem() , new TestItem(), new TestItem()];

        list.add(arr);

        var count = 0;
        var accum = 0;

        list.each(function(item, i){
          
          expect(i).to.be.equal(accum++);
          expect(item.cid).to.be.equal(arr[count].cid);
          count++;
          
          expect(this.name).to.be.equal('context');

        }, { name: 'context' });

        expect(count).to.be.equal(list.length);
      });

    });

    describe('#indexOf', function(){

      it('must return the index of an item by cid or instance', function(){
        var list = new TestList();
        
        var searchItem = new TestItem();
        var searchId = searchItem.cid;

        var arr = [new TestItem() , new TestItem(), searchItem, new TestItem()];

        list.add(arr);

        var idxByCID = list.indexOf(searchId);
        expect(idxByCID).to.be.equal(2);

        var idxByInstance = list.indexOf(searchItem);
        expect(idxByInstance).to.be.equal(2);
      });

      it('must return -1 if item is not found', function(){
        var notInList = new TestItem();

        var list = new TestList([
          new TestItem() , new TestItem(), new TestItem()
        ]);

        var idx = list.indexOf(notInList);
        expect(idx).to.be.equal(-1);

        idx = list.indexOf('zzzz');
        expect(idx).to.be.equal(-1);
      });

    });

    describe('#insertAt', function(){

      it('must insert an item at a given index and fire add event', function(){
        var list = new TestList([
          new TestItem() , new TestItem(), new TestItem()
        ]);

        var insertItem = new TestItem();
        var insertedCID = insertItem.cid;

        var emitted = 0;
        list.on('add', function(item){
          emitted++;
          expect(item.cid).to.be.equal(insertedCID);
        });
        
        var listLen = list.length;

        list.insertAt(2, insertItem);

        expect(list.length).to.be.equal(listLen+1);

        var idxInserted = list.indexOf(insertItem);
        expect(idxInserted).to.be.equal(2);

        expect(emitted).to.be.equal(1);
      });

      it('must throw an error if type is not allowed', function(){

        var list = new TestList([
          new TestItem() , new TestItem(), new TestItem()
        ]);

        expect(function(){
          list.insertAt(2, new GameObject());
        }).to.throw(/invalid child type/);

      });

      it('must if index is not provided', function(){
        var list = new TestList([
          new TestItem() , new TestItem(), new TestItem()
        ]);

        expect(function(){
          list.insertAt(new TestItem());
        }).to.throw(/expected an index/);

      });

      it('must throw an error if item already exists', function(){
        var duplicated = new TestItem();

        var list = new TestList([
          new TestItem() , duplicated, new TestItem()
        ]);

        expect(function(){
          list.insertAt(0, duplicated);
        }).to.throw(/item already exists/);
      });

    });

  });

});
