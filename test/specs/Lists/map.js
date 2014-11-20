
var MapList = require('../../../src/MapList');
var Emitter = require('../../../src/Emitter');

var chai = require('chai');
var expect = chai.expect;

var GameObject = require('../../../src/GameObject');

var TestItem = GameObject.extend();

var TestMapListGeneric = MapList.extend();

var TestMapList = MapList.extend({
  childType: GameObject
});

describe('MapList', function(){

  it('must inherit from Emitter', function(){
    expect(MapList.prototype).to.be.an.instanceof(Emitter);
  });

  describe('Constructor', function(){

    it('must allow to create an empty list', function(){
      var list = new MapList();
      expect(list.length).to.be.equal(0);
    });

    it('must allow to create from an object', function(){
      var data = new TestMapListGeneric({
        player: 'wowowow',
        pointer: 'wesa'
      });

      expect(data.length).to.equal(2);
    });

    it('must allow to create from an object validating childType', function(){
      var data = new TestMapList({
        name1: new GameObject(),
        name2: new GameObject()
      });

      expect(data.length).to.equal(2);
    });

    it('must throw an error if childType is specify and invalid', function(){

      expect(function(){
        var data = new TestMapList({
          name1: new GameObject(),
          name2: { name: 'test' }
        });
      }).to.throw(/invalid child type/i);

    });

  });

  describe('Methods', function(){

    describe('#add', function(){

      it('must allow to add an Item', function(){
        var list = new TestMapList();
        list.add('name1', new TestItem());

        expect(list.length).to.be.equal(1);
      });

      it('must fire an add event with the item added', function(){
        var list = new TestMapList();

        var item = new TestItem();

        var emitted = 0;
        list.on('add', function(value, key){
          emitted++;
          expect(key).to.be.equal('name1');
        });

        list.add('name1', item);
        expect(emitted).to.be.equal(1);
      });

      it('must throw an error if Item is not allowed type', function(){
        var list = new TestMapList();

        expect(function(){
          list.add('name1', {});
        }).to.throw(/invalid child type/);

      });

      it('must throw an error when trying to add element with same name',
        function(){
          var list = new TestMapListGeneric();
          list.add('test', {});

          expect(function(){
            list.add('test', {});
          }).to.throw(/duplicate key/i);
        }
      );

      describe('multiple values', function(){

        it('must allow to add multiples Items', function(){
          var list = new TestMapList();

          list.add({
            'name1': new TestItem(),
            'name2': new TestItem(),
            'name3': new TestItem(),
          });

          expect(list.length).to.be.equal(3);
        });

        it('must fire an add event for each item added', function(){
          var list = new TestMapList();

          var emitted = 0;
          list.on('add', function(value, key){
            emitted++;
          });

          list.add({
            'name1': new TestItem(),
            'name2': new TestItem(),
            'name3': new TestItem(),
          });

          expect(emitted).to.be.equal(3);
        });

        it('must throw an error if Item is not allowed type', function(){
          var list = new TestMapList();

          expect(function(){
            list.add({
              'name1': new TestItem(),
              'name2': new MapList(),
              'name3': new TestItem(),
            });
          }).to.throw(/invalid child type/);

        });

        it('must throw an error when trying to add element with same name',
          function(){
            var list = new TestMapListGeneric();
            list.add('test', {});

            expect(function(){
              list.add({
                'name1': {},
                'test': {},
                'name3':{},
              });
            }).to.throw(/duplicate key/i);
          }
        );

      });

    });

    describe('#get', function(){

       it('Must return an element from list', function(){
        var list = new TestMapListGeneric();
        var fakeObj = {};
        list.add('test', fakeObj);
        expect(list.get('test')).to.equal(fakeObj);
      });

      it('Must return null if no element', function(){
        var list = new TestMapListGeneric();
        expect(list.get('testtests')).to.be.null;
      });

    });

    describe('#remove', function(){

      it('Must remove the element from cache and return it', function(){
        var list = new TestMapListGeneric();
        var fakeObj = {};
        list.add('test', fakeObj);

        var emitted = 0;
        list.on('remove', function(key, value){
          emitted++;
          expect(key).to.be.equal('test');
        });

        expect(list.remove('test')).to.equal(fakeObj);
        expect(list.get('test')).to.be.null;
        expect(list.length).to.equal(0);
      });

    });

    describe('#clear', function(){

      it('must allow to clear the map and emit event clear', function(){
        var list = new TestMapList({
          name1: new GameObject(),
          name2: new GameObject()
        });

        expect(list.length).to.be.equal(2);

        var emitted = 0;
        list.on('clear', function(){
          emitted++;
        });

        list.clear();

        expect(list.length).to.be.equal(0);
        expect(emitted).to.be.equal(1);
      });

    });

    describe('#each', function(){

      it('must allow iterate through the list', function(){

        var keys = ['name1', 'name2', 'name3'];

        var items = {
          name1: new GameObject(),
          name2: new GameObject(),
          name3: new GameObject()
        };

        var list = new TestMapList(items);
        expect(list.length).to.be.equal(3);

        var accum = 0;

        list.each(function(value, key){

          var itemKey = keys[accum++];

          expect(key).to.be.equal(itemKey);
          expect(value.cid).to.be.equal(items[itemKey].cid);

          expect(this.name).to.be.equal('context');

        }, { name: 'context' });

        expect(accum).to.be.equal(list.length);
      });

    });

  });

});
