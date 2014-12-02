
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

    it ('#getPoints', function(){

      var rect = new Rectangle({
        position: new Point(10, 50),
        size: { width: 100, height: 50 }
      });

      var points = rect.getPoints();
      expect(points.length).to.be.equal(4);

      var ps = [
        { x: 10, y: 50 },
        { x: 110, y: 50 },
        { x: 110, y: 100 },
        { x: 10, y: 100 },
      ];

      ps.forEach(function(p, i){
        expect(points[i].x).to.be.equal(p.x);
        expect(points[i].y).to.be.equal(p.y);
      });

      var offset = new Point(10, 20);

      points = rect.getPoints(offset);
      expect(points.length).to.be.equal(4);

      ps = [
        { x: 20, y: 70 },
        { x: 120, y: 70 },
        { x: 120, y: 120 },
        { x: 20, y: 120 },
      ];

      ps.forEach(function(p, i){
        expect(points[i].x).to.be.equal(p.x);
        expect(points[i].y).to.be.equal(p.y);
      });

    });

    it ('#nearestPoint', function(){

      var rect = new Rectangle({
        position: new Point(50, 80),
        size: { width: 130, height: 100 }
      });

      var nearest = rect.nearestPoint(new Point(150, 10));
      expect(Math.round(nearest.x)).to.be.equal(150);
      expect(Math.round(nearest.y)).to.be.equal(80);

      nearest = rect.nearestPoint(new Point(150, 10), new Point(50, 20));
      expect(Math.round(nearest.x)).to.be.equal(150);
      expect(Math.round(nearest.y)).to.be.equal(100);

    });

    it ('#getBounds', function(){

      var rect = new Rectangle({
        position: new Point(50, 80),
        size: { width: 130, height: 100 }
      });

      var bounds = rect.getBounds();
      expect(bounds).to.be.instanceof(Rectangle);
      expect(Math.round(bounds.position.x)).to.be.equal(50);
      expect(Math.round(bounds.position.y)).to.be.equal(80);
      expect(Math.round(bounds.size.width)).to.be.equal(130);
      expect(Math.round(bounds.size.height)).to.be.equal(100);

      bounds = rect.getBounds(new Point(50, 20));
      expect(Math.round(bounds.position.x)).to.be.equal(100);
      expect(Math.round(bounds.position.y)).to.be.equal(100);
      expect(Math.round(bounds.size.width)).to.be.equal(130);
      expect(Math.round(bounds.size.height)).to.be.equal(100);

    });

    it ('#getCenter', function(){

      var rect = new Rectangle({
        position: new Point(50, 80),
        size: { width: 130, height: 100 }
      });

      var center = rect.getCenter();
      expect(center).to.be.instanceof(Point);
      expect(Math.round(center.x)).to.be.equal(115);
      expect(Math.round(center.y)).to.be.equal(130);

    });

    it ('#getHead', function(){

      var rect = new Rectangle({
        position: new Point(50, 80),
        size: { width: 130, height: 100 }
      });

      var point = rect.getHead();
      expect(point).to.be.instanceof(Point);
      expect(Math.round(point.x)).to.be.equal(115);
      expect(Math.round(point.y)).to.be.equal(80);

    });

    it ('#getFeet', function(){

      var rect = new Rectangle({
        position: new Point(50, 80),
        size: { width: 130, height: 100 }
      });

      var point = rect.getFeet();
      expect(point).to.be.instanceof(Point);
      expect(Math.round(point.x)).to.be.equal(115);
      expect(Math.round(point.y)).to.be.equal(180);

    });

  });

});