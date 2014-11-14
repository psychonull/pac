
var Shape = require('../../../../src/Shape');
var Polygon = require('../../../../src/Polygon');
var Point = require('../../../../src/Point');

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
        fill: 'white',
        stroke: 'yellow',
        lineWidth: 2
      });
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

    it('#isConcave', function(){
      var convex = new Polygon([0,0 , 0,2 , 2,2 , 2,0]);
      expect(convex.isConcave()).to.be.false;
      var concave = new Polygon(
        [0,0 , 3,0 , 3,1 , 2,1 , 2,2 , 2,3 , 3,3 , 0,3 ]
      );
      expect(concave.isConcave()).to.be.true;
    });

  });

});
