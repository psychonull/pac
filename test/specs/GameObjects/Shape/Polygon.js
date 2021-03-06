
var Shape = require('../../../../src/Shape');
var Polygon = require('../../../../src/Polygon');
var Point = require('../../../../src/Point');
var Rectangle = require('../../../../src/Rectangle');

var expect = require('chai').expect;

describe('Polygon', function(){

  it('must expose Polygon Class', function(){
    expect(pac.Polygon).to.be.a('function');
  });

  it('must be an Shape', function(){
    expect(Polygon.prototype).to.be.an.instanceof(Shape);
  });

  describe('Constructor', function(){

    it ('must create with defaults', function(){
      var poly = new Polygon();

      expect(poly.position.x).to.be.equal(0);
      expect(poly.position.y).to.be.equal(0);

      expect(poly.name).to.be.equal('Polygon');
      expect(poly.points.length).to.be.equal(0);
    });

    it('must error if the parameter is not an array', function(){
      expect(function(){
        var poly = new Polygon('lol');
      }).to.throw(/invalid argument/i);
    });

    it('can receive an array of Points', function(){
      var poly = new Polygon([new Point(0,0), new Point(0,2), new Point(2,0)]);
      expect(poly.points.length).to.equal(3);
    });

    it('can receive a plain array of coordinates', function(){
      var poly = new Polygon([0,0 , 0,2 , 2,2 , 2,0]);
      expect(poly.points.length).to.equal(4);
      expect(poly.points[0].x).to.equal(0);
      expect(poly.points[3].x).to.equal(2);
    });

    it('accepts options as second parameter', function(){

      var poly = new Polygon([0,0 , 0,2 , 2,2 , 2,0], {
        position: new Point(10, 10),
        fill: 'white',
        stroke: 'yellow',
        lineWidth: 2
      });

      expect(poly.points[0].x).to.be.equal(10);
      expect(poly.points[0].y).to.be.equal(10);

      expect(poly.points[2].x).to.be.equal(12);
      expect(poly.points[2].y).to.be.equal(12);

      expect(poly.fill).to.equal('white');
      expect(poly.stroke).to.equal('yellow');
      expect(poly.lineWidth).to.equal(2);
    });

  });

  describe('Methods', function(){

    it('#isPointInside', function(){
      var poly = new Polygon([0,0 , 0,2 , 2,2 , 2,0]);
      expect(poly.points.length).to.equal(4);
      expect(poly.isPointInside(new Point(1, 1))).to.be.true;
      expect(poly.isPointInside(new Point(4, 1))).to.be.false;
    });

    it('#getPath', function(){
      var poly = new Polygon([new Point(0,0), new Point(1,1), new Point(2,1)]);

      var path = poly.getPath();

      expect(path.length).to.equal(6);
      expect(path).to.eql([0,0,1,1,2,1]);
    });

    it ('#nearestPoint', function(){

      var poly = new Polygon([
        new Point(30, 50),
        new Point(120, 70),
        new Point(130, 140),
        new Point(80, 210),
        new Point(50, 170)
      ]);

      var nearest = poly.nearestPoint(new Point(90, 10));
      expect(Math.round(nearest.x)).to.be.equal(79);
      expect(Math.round(nearest.y)).to.be.equal(61);

      nearest = poly.nearestPoint(new Point(90, 10), new Point(50, 20));
      expect(Math.round(nearest.x)).to.be.equal(80);
      expect(Math.round(nearest.y)).to.be.equal(70);

    });

    it('#isConcave', function(){
      var convex = new Polygon([0,0 , 0,2 , 2,2 , 2,0]);

      expect(convex.isConcave()).to.be.false;

      var concave = new Polygon(
        [0,0 , 3,0 , 3,1 , 2,1 , 2,2 , 2,3 , 3,3 , 0,3 ]
      );

      expect(concave.isConcave()).to.be.true;
    });

    it ('#getBounds', function(){

      var poly = new Polygon([
        new Point(30, 50),
        new Point(120, 70),
        new Point(130, 140),
        new Point(80, 210),
        new Point(50, 170)
      ]);

      var bounds = poly.getBounds();
      expect(bounds).to.be.instanceof(Rectangle);
      expect(Math.round(bounds.position.x)).to.be.equal(30);
      expect(Math.round(bounds.position.y)).to.be.equal(50);
      expect(Math.round(bounds.size.width)).to.be.equal(100);
      expect(Math.round(bounds.size.height)).to.be.equal(160);

      bounds = poly.getBounds(new Point(50, 50));
      expect(Math.round(bounds.position.x)).to.be.equal(80);
      expect(Math.round(bounds.position.y)).to.be.equal(100);
      expect(Math.round(bounds.size.width)).to.be.equal(100);
      expect(Math.round(bounds.size.height)).to.be.equal(160);

    });

  });

});
