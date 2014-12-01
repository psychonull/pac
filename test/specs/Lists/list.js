
var List = require('../../../src/List');
var Emitter = require('../../../src/Emitter');

var chai = require('chai');
var expect = chai.expect;

var GameObject = require('../../../src/GameObject');

var TestItem = GameObject.extend({

  init: function(options){
    this.test = (options && options.test) || false;
  },

});

var TestList = List.extend({
  childType: TestItem
});

var TestSort = GameObject.extend();

var TestSortListASC = TestList.extend({
  childType: GameObject,
  comparator: 'zIndex'
});

var TestSortListDESC = TestList.extend({
  childType: GameObject,
  comparator: '-zIndex'
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

    it('must allow to create from a List', function(){
      var listFrom = new List([ new TestItem(), new TestItem() ]);
      var list = new List(listFrom);

      expect(list.length).to.be.equal(2);
      expect(list._items.length).to.be.equal(2);

      listFrom.clear();
      expect(list.length).to.be.equal(2);
    });

    it('must allow to create from an array of generic jsons', function(){
      var arr = [ { test: 1 }, { test: 2 }, { test: 3 } ];

      var list = new List(arr);

      expect(list.length).to.be.equal(3);
      expect(list._items.length).to.be.equal(3);

      list.each(function(item){
        expect(item.hasOwnProperty('cid')).to.be.true;
        expect(item.cid).to.be.a('string');
      });
    });

    it('must throw an error first argument is not an array', function(){

      expect(function(){
        var list = new TestList({});
      }).to.throw('invalid argument, expected an array or List');

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

    it('must sort the list if it has a comparator', function(){

      var obj1 = new TestSort({ zIndex: 1 });
      var obj2 = new TestSort({ zIndex: 2 });
      var obj3 = new TestSort({ zIndex: 3 });

      var list = new TestSortListASC([obj2, obj3, obj1]);

      expect(list.length).to.be.equal(3);

      expect(list.at(0).cid).to.be.equal(obj1.cid);
      expect(list.at(1).cid).to.be.equal(obj2.cid);
      expect(list.at(2).cid).to.be.equal(obj3.cid);

      list = new TestSortListDESC([obj2, obj3, obj1]);

      expect(list.length).to.be.equal(3);

      expect(list.at(0).cid).to.be.equal(obj3.cid);
      expect(list.at(1).cid).to.be.equal(obj2.cid);
      expect(list.at(2).cid).to.be.equal(obj1.cid);

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

      it('must keep the list sorted if has a comparator', function(){

        var obj1 = new TestSort({ zIndex: 1 });
        var obj2 = new TestSort({ zIndex: 2 });
        var obj4 = new TestSort({ zIndex: 4 });
        var obj6 = new TestSort({ zIndex: 6 });

        var list = new TestSortListASC([obj6, obj4, obj1]);

        var emitted = 0;
        list.on('add', function(obj){
          emitted++;
          expect(list.at(1).cid).to.be.equal(obj.cid);
        });

        list.add(obj2);

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

      it('must be an at() alias if a number is passed', function(){
        var list = new TestList();
        var searchItem = new TestItem();

        list.add([ new TestItem(), new TestItem(), searchItem, new TestItem()]);

        var found = list.get(2);
        expect(found).to.be.equal(searchItem);
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

    describe('#find', function(){

      it('must return a new List of items found', function(){

        var list = new TestList([
          new TestItem(),
          new TestItem({ name: 'named' }),
          new TestItem({ test: true })
        ]);

        expect(list.at(0).name).to.be.equal('GameObject');
        expect(list.at(0).test).to.be.equal(false);

        expect(list.at(1).name).to.be.equal('named');
        expect(list.at(1).test).to.be.equal(false);

        expect(list.at(2).name).to.be.equal('GameObject');
        expect(list.at(2).test).to.be.equal(true);

        var result = list.find('GameObject');
        expect(result).to.be.instanceof(List);
        expect(result.length).to.be.equal(2);

        result = list.find('named');
        expect(result.length).to.be.equal(1);

        result = list.find('no one');
        expect(result.length).to.be.equal(0);

        result = list.find({ test: true });
        expect(result.length).to.be.equal(1);

        result = list.find({ test: false });
        expect(result.length).to.be.equal(2);
      });

    });

    describe('#findOne', function(){

      it('must return a the first item found', function(){

        var list = new TestList([
          new TestItem(),
          new TestItem({ name: 'named' }),
          new TestItem({ test: true })
        ]);

        var result = list.findOne('GameObject');
        expect(result).to.be.equal(list.at(0));

        result = list.findOne('named');
        expect(result).to.be.equal(list.at(1));

        result = list.findOne('no one');
        expect(result).to.be.undefined;

        result = list.findOne({ test: true });
        expect(result).to.be.equal(list.at(2));

        result = list.findOne({ test: false });
        expect(result).to.be.equal(list.at(0));
      });

    });

  });

});
