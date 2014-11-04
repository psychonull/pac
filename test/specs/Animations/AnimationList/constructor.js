
var AnimationList = require('../../../../src/AnimationList');
var Animation = require('../../../../src/Animation');

var chai = require('chai');
var expect = chai.expect;

describe('Constructor', function(){

  it('must allow to create as empty', function(){

    var animations = new AnimationList();

    expect(animations.default).to.be.equal(null);
    expect(animations.current).to.be.equal(null);
  });

  it('must allow to create with defaults', function(){

    var animations = new AnimationList({
      'idle': new Animation()
    }, {
      default: 'idle'
    });

    expect(animations.default).to.be.equal('idle');
    expect(animations.current._name).to.be.equal('idle');
    expect(animations.current.isRunning).to.be.false;
  });

  it('must allow to create with autoplay', function(){
    
    var animations = new AnimationList({
      'idle': new Animation({ name: 'idle' })
    }, {
      default: 'idle',
      autoplay: true
    });

    expect(animations.default).to.be.equal('idle');
    expect(animations.current._name).to.be.equal('idle');
    expect(animations.current.isRunning).to.be.true;
  });

});