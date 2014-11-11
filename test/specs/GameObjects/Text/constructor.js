
var Text = require('../../../../src/Text');
var Point = require('../../../../src/Point');

var expect = require('chai').expect;

describe('Constructor', function(){

  it ('must create a Text with defaults', function(){
    var text = new Text();

    expect(text.position.x).to.be.equal(0);
    expect(text.position.y).to.be.equal(0);
    expect(text.value).to.equal('');
  });

  it('must allow to pass the value as first parameter', function(){
    var text = new Text('hi');
    expect(text.value).to.equal('hi');
  });

  it('must allow to pass the value with a options parameter', function(){
    var text = new Text({
      value: 'hi',
      position: new Point(1,2)
    });
    expect(text.value).to.equal('hi');
    expect(text.position.x).to.equal(1);
    expect(text.position.y).to.equal(2);
  });

  it('must allow to pass both value and options separately', function(){
    var pos = new Point(1,1);
    var text = new Text('hi', {
      position: pos
    });
    expect(text.value).to.equal('hi');
    expect(text.position.x).to.equal(1);
    expect(text.position.y).to.equal(1);
  });

  it('must set all the defaults', function(){
    var text = new Text();
    expect(text.font).to.equal('20px Arial');
    expect(text.fill).to.equal('black');
    expect(text.stroke).to.equal('black');
    expect(text.strokeThickness).to.equal(0);
    expect(text.wordWrap).to.equal(0);
    expect(text.isBitmapText).to.be.false;
  });

  it('must allow to pass all settings', function(){
    var text = new Text({
      font: '20px Helvetica',
      fill: 'white',
      stroke: 'yellow',
      strokeThickness: 2,
      wordWrap: 200,
      isBitmapText: true
    });

    expect(text.font).to.equal('20px Helvetica');
    expect(text.fill).to.equal('white');
    expect(text.stroke).to.equal('yellow');
    expect(text.strokeThickness).to.equal(2);
    expect(text.wordWrap).to.equal(200);
    expect(text.isBitmapText).to.be.true;
  });

});
