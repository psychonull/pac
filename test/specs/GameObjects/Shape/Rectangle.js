
var Shape = require('../../../../src/Shape');
var Rectangle = require('../../../../src/Rectangle');
var Point = require('../../../../src/Point');

var expect = require('chai').expect;

describe('Rectangle', function(){

  it('must expose Rectangle Class', function(){
    expect(pac.Rectangle).to.be.a('function');
  });

  it('must be an Shape', function(){
    expect(Rectangle.prototype).to.be.an.instanceof(Shape);
  });

  describe('Constructor', function(){

    it ('must create with defaults', function(){
      var rect = new Rectangle();

      expect(rect.name).to.be.equal('Rectangle');
      expect(rect.position.x).to.be.equal(0);
      expect(rect.position.y).to.be.equal(0);

      expect(rect.size.width).to.be.equal(50);
      expect(rect.size.height).to.be.equal(50);

      expect(rect.fill).to.equal(null);
      expect(rect.stroke).to.equal(null);
      expect(rect.lineWidth).to.equal(1);
    });

    it('must create with settings', function(){
      var rect = new Rectangle({
        position: new Point(50, 50),
        size: { width: 100, height: 100 },
        fill: 'white',
        stroke: 'yellow',
        lineWidth: 2,
      });

      expect(rect.position.x).to.be.equal(50);
      expect(rect.position.y).to.be.equal(50);

      expect(rect.size.width).to.be.equal(100);
      expect(rect.size.height).to.be.equal(100);

      expect(rect.fill).to.equal('white');
      expect(rect.stroke).to.equal('yellow');
      expect(rect.lineWidth).to.equal(2);
    });

  });

  describe('Methods', function(){

    it ('#isPointInside', function(){
      var rect = new Rectangle({
        position: new Point(50, 50),
        size: { width: 100, height: 100 }
      });

      var inside = rect.isPointInside(new Point(60, 60));

      var insideOffset =
        rect.isPointInside(new Point(150, 150), new Point(50, 50));

      var outside = rect.isPointInside(new Point(150, 150));

      var outsideOffset =
        rect.isPointInside(new Point(150, 150), new Point(200, 200));

      expect(inside).to.be.true;
      expect(insideOffset).to.be.true;

      expect(outside).to.be.false;
      expect(outsideOffset).to.be.false;
    });

  });

});