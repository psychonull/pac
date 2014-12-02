
var Point = require('../../../../src/Point');
var Sprite = require('../../../../src/Sprite');

var Execute = require('../../../../src/actions/Execute');

var chai = require('chai');
var expect = chai.expect;

var TestObj = Sprite.extend({
  texture: 'testTexture'
});

describe('Execute', function(){

  describe('Create', function(){

    it('must be non blocking by default', function(){
      var fn = function cb(){ };
      var exec = new Execute(fn);

      expect(exec.isBlocking).to.be.false;
      expect(exec.callback).to.be.equal(fn);
    });

    it('must allow to set as options object', function(){
      var fn = function cb(){ };
      var exec = new Execute({
        callback: fn
      });

      expect(exec.isBlocking).to.be.false;
      expect(exec.callback).to.be.equal(fn);
    });

  });

  describe('Running', function(){

    it('must an call the function on update with context & sending the action',
      function(){

      var obj;
      var _dt = 0.1;

      var called = 0;
      var act = new Execute(function(dt, action){
        called++;
        expect(action).to.be.equal(act);
        expect(dt).to.be.equal(_dt);
        expect(this).to.be.equal(obj);
      });

      obj = new TestObj({
        actions: [ act ]
      });

      obj.updateActions(_dt);
      expect(called).to.be.equal(1);

      expect(obj.actions.length).to.be.equal(1);
    });

    it('must finish the action if returns true', function(){

      var obj;
      var _dt = 0.1;

      var called = 0;
      var act = new Execute(function(dt, action){
        called++;
        return true;
      });

      obj = new TestObj({
        actions: [ act ]
      });

      obj.updateActions(_dt);
      expect(called).to.be.equal(1);

      expect(obj.actions.length).to.be.equal(0);
    });

  });

});