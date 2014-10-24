
var Sprite = require('../../../../src/Sprite');
var expect = require('chai').expect;

describe('Methods', function(){
  
  describe('#update', function(){

    it('must expose update method', function(){
      var obj = new pac.Sprite();
      expect(obj.update).to.be.a('function');
    });

  });

});
