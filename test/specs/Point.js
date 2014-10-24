
var pac = require('../../src/pac');
var Point = require('../../src/Point');

var chai = require('chai');
var expect = chai.expect;

describe('Point', function(){
  
  it('must expose Point Class', function(){
    expect(pac.Point).to.be.a('function');
  });

  it('must be a Point2 wrapper', function(){
    var p = new pac.Point();

    expect(p.x).to.be.equal(0);
    expect(p.y).to.be.equal(0);

    p = new pac.Point(1, 2);

    expect(p.x).to.be.equal(1);
    expect(p.y).to.be.equal(2);

    expect(p.add).to.be.a('function');
  });

});
