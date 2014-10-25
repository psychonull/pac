
var Sprite = require('../../../../src/Sprite');
var expect = require('chai').expect;

describe('Constructor', function(){

  it ('must create an Sprite with defaults', function(){
    var sprite = new Sprite({
      texture: 'test' 
    });

    expect(sprite.position.x).to.be.equal(0);
    expect(sprite.position.y).to.be.equal(0);

    expect(sprite.size).to.be.equal(null);
  });

  it ('must create an Sprite', function(){
    var sprite = new Sprite({
      texture: 'test',
      position: new pac.Point(100, 100),
      size: {
        width: 50,
        height: 50
      }
    });

    expect(sprite.position.x).to.be.equal(100);
    expect(sprite.position.y).to.be.equal(100);

    expect(sprite.size.width).to.be.equal(50);
    expect(sprite.size.height).to.be.equal(50);
  });

  it ('must throw an error if no texture is specify', function(){

    expect(function(){
      var sprite = new Sprite();
    }).to.throw('Expected [texture] name of Sprite');

  });

});