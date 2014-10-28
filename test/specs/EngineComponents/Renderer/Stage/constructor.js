
var Stage = require('../../../../../src/Stage');
var List = require('../../../../../src/List');
var Drawable = require('../../../../../src/Drawable');

var expect = require('chai').expect;

describe('Constructor', function(){

  it('should init a List object', function(){
    expect(Stage.prototype).to.be.an.instanceof(List);

    var stage = new Stage();
    expect(stage.length).to.be.equal(0);
    expect(stage.childType).to.be.equal(Drawable);
  });

});