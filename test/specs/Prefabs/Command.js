
var Point = require('../../../src/Point');
var Command = require('../../../src/prefabs/Command');

var chai = require('chai');
var expect = chai.expect;

describe('Command', function(){

  it('must allow to create a Command', function(){

    var comm = new Command({
      command: 'use',
      value: 'Use',
      position: new Point(20, 20)
    });

    expect(comm.position.x).to.be.equal(20);
    expect(comm.position.y).to.be.equal(20);

    expect(comm.command).to.be.equal('use');
    expect(comm.value).to.be.equal('Use');

  });

});