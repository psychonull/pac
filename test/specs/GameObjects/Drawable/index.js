
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');

var chai = require('chai');
var expect = chai.expect;

describe('Drawable', function(){

  it('must expose Drawable Class', function(){
    expect(pac.Drawable).to.be.a('function');
  });

  it('must be a GameObject', function(){
    expect(pac.Drawable.prototype).to.be.an.instanceof(GameObject);
  });

  it('must expose update Method', function(){
    var obj = new pac.Drawable();
    expect(obj.update).to.be.a('function');
  });

  it('must create a Drawable', function(){
    var obj = new pac.Drawable();
    
    expect(obj.position.x).to.be.equal(0);
    expect(obj.position.y).to.be.equal(0);
  });

  it('must create a Drawable with defaults', function(){
    var obj = new pac.Drawable({
      position: new pac.Point(100, 100)
    });
    
    expect(obj.position.x).to.be.equal(100);
    expect(obj.position.y).to.be.equal(100);
  });

});