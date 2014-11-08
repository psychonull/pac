
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
      var rect = new Circle();

      expect(rect.position.x).to.be.equal(0);
      expect(rect.position.y).to.be.equal(0);

      expect(rect.radius).to.be.equal(50);

      expect(rect.fill).to.equal(null);
      expect(rect.stroke).to.equal(null);
      expect(rect.lineWidth).to.equal(1);
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

});