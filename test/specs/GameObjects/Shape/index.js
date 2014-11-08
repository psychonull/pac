
var pac = require('../../../../src/pac');
var Drawable = require('../../../../src/Drawable');
var Shape = require('../../../../src/Shape');

var chai = require('chai');
var expect = chai.expect;

describe('Shape', function(){

  it('must expose Shape Class', function(){
    expect(pac.Shape).to.be.a('function');
  });

  it('must be a Drawable', function(){
    expect(pac.Shape.prototype).to.be.an.instanceof(Drawable);
  });

  describe('Constructor', function(){

    it ('must create with defaults', function(){
      var shape = new Shape();

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

});