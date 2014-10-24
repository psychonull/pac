
var pac = require('../../../../src/pac');
var Emitter = require('../../../../src/Emitter');

var chai = require('chai');
var expect = chai.expect;

describe('GameObject', function(){

  it('must expose GameObject Class', function(){
    expect(pac.GameObject).to.be.a('function');
  });

  it('must be an Emitter', function(){
    expect(pac.GameObject.prototype).to.be.an.instanceof(Emitter);
  });

  it('must expose update Method', function(){
    var obj = new pac.GameObject();
    expect(obj.update).to.be.a('function');
  });

});