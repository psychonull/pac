
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var Tween = require('../../../../src/actions/Tween');
var TWEEN = require('tween.js');

var chai = require('chai');
var expect = chai.expect;

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

describe('Tween', function(){

  describe('Create', function(){

    it('must be created with defaults by options json', function(){
      var opts = {
        field: 'position',
        to: { x: 500 },
        duration: 2000,
        easing: 'Elastic.InOut',
        delay: 500,
        repeat: 2,
        yoyo: true,
        isBlocking: true
      };

      var tween = new Tween(opts);

      expect(tween.isBlocking).to.be.true;
      expect(tween.field).to.be.equal(opts.field);
      expect(tween.to).to.be.equal(opts.to);
      expect(tween.duration).to.be.equal(opts.duration);
      expect(tween.easing).to.be.equal(TWEEN.Easing.Elastic.InOut);
      expect(tween.delay).to.be.equal(opts.delay);
      expect(tween.repeat).to.be.equal(opts.repeat);
      expect(tween.yoyo).to.be.equal(opts.yoyo);

      // check deafaults

      delete opts.easing;
      delete opts.duration;
      delete opts.isBlocking;

      tween = new Tween(opts);

      expect(tween.isBlocking).to.be.false;
      expect(tween.duration).to.be.equal(1000);
      expect(tween.easing).to.be.equal(TWEEN.Easing.Linear.None);
    });

    it('must be created with defaults by parameters', function(){

      var opts = {
        field: 'position',
        to: { x: 500 },
        duration: 2000,
        easing: 'Elastic.InOut'
      };

      var tween = new Tween(opts.field, opts.to, opts.duration, opts.easing);

      expect(tween.isBlocking).to.be.false;
      expect(tween.field).to.be.equal(opts.field);
      expect(tween.to).to.be.equal(opts.to);
      expect(tween.duration).to.be.equal(opts.duration);
      expect(tween.easing).to.be.equal(TWEEN.Easing.Elastic.InOut);
      expect(tween.delay).to.be.equal(0);
      expect(tween.repeat).to.be.equal(0);
      expect(tween.yoyo).to.be.equal(false);

      tween = new Tween(opts.to, opts.duration, opts.easing);

      expect(tween.isBlocking).to.be.false;
      expect(tween.field).to.be.null;
      expect(tween.to).to.be.equal(opts.to);
      expect(tween.duration).to.be.equal(opts.duration);
      expect(tween.easing).to.be.equal(TWEEN.Easing.Elastic.InOut);
      expect(tween.delay).to.be.equal(0);
      expect(tween.repeat).to.be.equal(0);
      expect(tween.yoyo).to.be.equal(false);
    });

    it('must throw an error if [to] is not defined', function(){

      expect(function(){
        var tween = new Tween();
      }).to.throw('Tween Action: Expected [to] parameter');

      expect(function(){
        var tween = new Tween('position');
      }).to.throw('Tween Action: Expected [to] parameter');

      expect(function(){
        var tween = new Tween({
          field: 'position'
        });
      }).to.throw('Tween Action: Expected [to] parameter');

      expect(function(){
        var tween = new Tween({
          field: 'position',
          to: {}
        });
      }).to.throw('Tween Action: Expected [to] parameter');

    });

  });

  describe('Running', function(){

    it('must create a Tween onStart', function(){

      // main object
      var tweenAct = new Tween({ x: 200 }, 1000);

      var obj = new TestObj({
        actions: [ tweenAct ]
      });

      tweenAct.onStart();

      expect(tweenAct.tweenedObj).to.be.equal(obj);
      expect(tweenAct.tween).to.be.instanceof(TWEEN.Tween);

      expect(TWEEN.getAll().length).to.be.equal(1);

      // with a property
      tweenAct = new Tween('position', { x: 200 });

      obj = new TestObj({
        actions: [ tweenAct ]
      });

      tweenAct.onStart();

      expect(tweenAct.tweenedObj).to.be.equal(obj.position);
      expect(tweenAct.tween).to.be.instanceof(TWEEN.Tween);

      expect(TWEEN.getAll().length).to.be.equal(2);

      TWEEN.removeAll();
      expect(TWEEN.getAll().length).to.be.equal(0);
    });

    it('must remove the Tween onEnd', function(){

      var tweenAct = new Tween({ x: 200 }, 1000);

      var obj = new TestObj({
        actions: [ tweenAct ]
      });

      tweenAct.onStart();

      expect(tweenAct.tweenedObj).to.be.equal(obj);
      expect(tweenAct.tween).to.be.instanceof(TWEEN.Tween);

      expect(TWEEN.getAll().length).to.be.equal(1);

      tweenAct.onEnd();

      expect(TWEEN.getAll().length).to.be.equal(0);

    });

    it('must update the tween and finalize it-self', function(){

      var dt = 0.2;

      var obj = new TestObj({
        actions: [ new Tween({ alpha: 150 }, 600) ]
      });

      obj.alpha = 0;

      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.alpha).to.be.equal(50);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.alpha).to.be.equal(100);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.alpha).to.be.equal(150);

      expect(obj.actions.length).to.be.equal(0);
    });

    it('must update the tween and finalize it-self for a property', function(){

      var dt = 0.2;

      var obj = new TestObj({
        position: new pac.Point(0, 100),
        actions: [ new Tween('position', { x: 300 }, 600) ]
      });

      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(100);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(300);

      expect(obj.actions.length).to.be.equal(0);
    });

    it('must run a repeat', function(){

      var dt = 0.2;
      var repeat = 1;

      var obj = new TestObj({
        position: new pac.Point(0, 100),
        actions: [ new Tween({
          field: 'position',
          to: { x: 300 },
          duration: 600,
          repeat: repeat
        }) ]
      });

      expect(obj.actions.length).to.be.equal(1);

      // it gets a little asynch because of 299.99999
      // and it runs more updates before onComplete

      for (var i=0; i<=repeat; i++){

        obj.updateActions(dt);
        expect(Math.round(obj.position.x)).to.be.equal(100);
        expect(obj.actions.length).to.be.equal(1);

        obj.updateActions(dt);
        expect(Math.round(obj.position.x)).to.be.equal(200);
        expect(obj.actions.length).to.be.equal(1);

        obj.updateActions(dt);
        expect(Math.round(obj.position.x)).to.be.equal(300);
        expect(obj.actions.length).to.be.equal(1);
      }

      obj.updateActions(dt);
      expect(obj.actions.length).to.be.equal(0);
    });

    it('must run a yoyo', function(){

      var dt = 0.2;

      var obj = new TestObj({
        position: new pac.Point(0, 100),
        actions: [ new Tween({
          field: 'position',
          to: { x: 300 },
          duration: 600,
          yoyo: true
        }) ]
      });

      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(100);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(300);
      expect(obj.actions.length).to.be.equal(1);

      // go back

      obj.updateActions(dt);
      expect(Math.round(obj.position.x)).to.be.equal(200);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(Math.round(obj.position.x)).to.be.equal(100);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(Math.round(obj.position.x)).to.be.equal(0);
      expect(obj.actions.length).to.be.equal(1);

      obj.updateActions(dt);
      expect(obj.actions.length).to.be.equal(0);
    });

    it('must allow to chain by blocking actions', function(){

      var dt = 0.2;

      var obj = new TestObj({
        position: new pac.Point(0, 100),
        actions: [
          new Tween({
            field: 'position',
            to: { x: 200 },
            duration: 400,
            isBlocking: true
          }),
          new Tween({
            field: 'position',
            to: { y: 200 },
            duration: 400
          })
        ]
      });

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(100);
      expect(obj.position.y).to.be.equal(100);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.position.y).to.be.equal(100);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.position.y).to.be.equal(150);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.position.y).to.be.equal(200);

    });

    it('must allow to run 2 tweens at same time', function(){

      var dt = 0.2;

      var obj = new TestObj({
        position: new pac.Point(0, 100),
        actions: [
          new Tween({
            field: 'position',
            to: { x: 200 },
            duration: 400
          }),
          new Tween({
            field: 'position',
            to: { y: 200 },
            duration: 400
          })
        ]
      });

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(100);
      expect(obj.position.y).to.be.equal(150);

      obj.updateActions(dt);
      expect(obj.position.x).to.be.equal(200);
      expect(obj.position.y).to.be.equal(200);

    });

  });

});