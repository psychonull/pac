
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
    
    expect(obj.cid).to.be.an('string');
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

  it('must allow to create a Drawable with a Layer', function(){

    var obj = new pac.Drawable({
      layer: 'background'
    });
    
    expect(obj.layer).to.be.equal('background');

    var TestObj = pac.Drawable.extend({
      layer: 'front'
    });

    var obj2 = new TestObj();
    expect(obj2.layer).to.be.equal('front');

    var obj3 = new TestObj({
      layer: 'middle'
    });

    expect(obj3.layer).to.be.equal('middle');
  });

  it('must allow to inherit setting defaults', function(){
    var calledInit = false;

    var MyDrawable = pac.Drawable.extend({
      
      position: { x: 200, y: 200 },

      init: function(options){
        expect(this.position.x).to.be.equal(300);
        expect(options.test).to.be.true;
        calledInit = true;
      }
    });

    var obj = new MyDrawable({
      test: true,
      position: { x: 300, y: 200 }
    });
    
    expect(calledInit).to.be.true;

    expect(obj.cid).to.be.an('string');
    expect(obj.position.x).to.be.equal(300);
    expect(obj.position.y).to.be.equal(200);
  });

});