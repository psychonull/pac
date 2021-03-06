
var pac = require('../../../../src/pac');
var GameObject = require('../../../../src/GameObject');
var Shape = require('../../../../src/Shape');

var chai = require('chai');
var expect = chai.expect;

describe('Shape', function(){

  it('must expose Shape Class', function(){
    expect(pac.Shape).to.be.a('function');
  });

  it('must be a GameObject', function(){
    expect(pac.Shape.prototype).to.be.an.instanceof(GameObject);
  });

  describe('Constructor', function(){

    it ('must throw an error for must override methods', function(){
      expect(function(){
        var shape = new Shape();
        shape.isPointInside();
      }).to.throw('Must Implement Shape.isPointInside()');

      expect(function(){
        var shape = new Shape();
        shape.nearestPoint();
      }).to.throw('Must Implement Shape.nearestPoint()');

      expect(function(){
        var shape = new Shape();
        shape.getBounds();
      }).to.throw('Must Implement Shape.getBounds()');
    });

    it ('must create with defaults', function(){
      var shape = new Shape();

      expect(shape.name).to.equal('Shape');
      expect(shape.fill).to.equal(null);
      expect(shape.stroke).to.equal(null);
      expect(shape.lineWidth).to.equal(1);
    });

    it('must create with settings', function(){
      var shape = new Shape({
        fill: 'white',
        stroke: 'yellow',
        lineWidth: 2,
      });

      expect(shape.fill).to.equal('white');
      expect(shape.stroke).to.equal('yellow');
      expect(shape.lineWidth).to.equal(2);
    });
  });

  require('./Rectangle');
  require('./Circle');
  require('./Polygon');

});
