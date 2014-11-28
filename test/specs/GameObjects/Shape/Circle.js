
var Shape = require('../../../../src/Shape');
var Circle = require('../../../../src/Circle');
var Point = require('../../../../src/Point');

var expect = require('chai').expect;

describe('Circle', function(){

  it('must expose Circle Class', function(){
    expect(pac.Circle).to.be.a('function');
  });

  it('must be an Shape', function(){
    expect(Circle.prototype).to.be.an.instanceof(Shape);
  });

  describe('Constructor', function(){

    it ('must create with defaults', function(){
      var circle = new Circle();

      expect(circle.name).to.be.equal('Circle');
      expect(circle.position.x).to.be.equal(0);
      expect(circle.position.y).to.be.equal(0);

      expect(circle.radius).to.be.equal(50);

      expect(circle.fill).to.equal(null);
      expect(circle.stroke).to.equal(null);
      expect(circle.lineWidth).to.equal(1);
    });

    it('must create with settings', function(){
      var rect = new Circle({
        position: new Point(50, 50),
        radius: 100,
        fill: 'white',
        stroke: 'yellow',
        lineWidth: 2,
      });

      expect(rect.position.x).to.be.equal(50);
      expect(rect.position.y).to.be.equal(50);

      expect(rect.radius).to.be.equal(100);

      expect(rect.fill).to.equal('white');
      expect(rect.stroke).to.equal('yellow');
      expect(rect.lineWidth).to.equal(2);
    });

  });

  describe('Methods', function(){

    it ('#isPointInside', function(){
      var circle = new Circle({
        position: new Point(50, 50),
        radius: 50
      });

      var inside = circle.isPointInside(new Point(70, 70));

      var insideOffset =
        circle.isPointInside(new Point(120, 120), new Point(50, 50));

      var outside = circle.isPointInside(new Point(100, 100));

      var outsideOffset =
        circle.isPointInside(new Point(100, 100), new Point(150, 150));

      expect(inside).to.be.true;
      expect(insideOffset).to.be.true;

      expect(outside).to.be.false;
      expect(outsideOffset).to.be.false;
    });

    it ('#nearestPoint', function(){
      var circle = new Circle({
        position: new Point(50, 50),
        radius: 30
      });

      var nearest = circle.nearestPoint(new Point(150, 10));
      expect(Math.round(nearest.x)).to.be.equal(78);
      expect(Math.round(nearest.y)).to.be.equal(39);

      nearest = circle.nearestPoint(new Point(150, 10), new Point(10, 20));
      expect(Math.round(nearest.x)).to.be.equal(85);
      expect(Math.round(nearest.y)).to.be.equal(53);

    });

  });

});