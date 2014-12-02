
var pac = require('../../../../src/pac');
var Speaker = require('../../../../src/actions/Speaker');
var Speak = require('../../../../src/actions/Speak');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Speak', function(){

  it('must require Speaker', function(){
    expect(Speak.prototype.requires).to.have.length(1);
    expect(Speak.prototype.requires[0]).to.equal(Speaker);
  });

  it('must initialize with options', function(){
    var onAfter = function(){};
    var speak = new Speak();
    expect(speak.text).to.equal('');
    expect(speak.duration).to.equal(2);
    expect(speak.minDuration).to.equal(1);
    expect(speak.after).to.be.null;
    speak = new Speak({
      text: 'Hola camarada',
      duration: 600,
      minDuration: 2,
      after: onAfter
    });
    expect(speak.text).to.equal('Hola camarada');
    expect(speak.duration).to.equal(600);
    expect(speak.minDuration).to.equal(2);
    expect(speak.after).to.equal(onAfter);
  });

  describe('#onStart', function(){

    it('must set elapsed to 0', function(){
        var speak = new Speak({
          text: 'aloja'
        });
        speak.actions = {
          owner: {
            speakerText: {
              value: ''
            }
          }
        };
        speak.onStart();

        expect(speak.elapsed).to.equal(0);
    });

    it('must set the speakerText value', function(){
        var speak = new Speak({
          text: 'aloja'
        });
        speak.actions = {
          owner: {
            speakerText: {
              value: ''
            }
          }
        };
        speak.onStart();

        expect(speak.actions.owner.speakerText.value).to.equal('aloja');
    });

  });

  describe('#update', function(){
    it('must mark itself as finished once the duration is over', function(){
      var speak = new Speak({
        duration: 10
      });
      speak.actions = {
        owner: {
          game: {
            inputs: {
              cursor: {
                isDown: false
              }
            }
          }
        }
      };
      speak.elapsed = 0;

      expect(speak.isFinished).to.be.false;
      speak.update(2);
      expect(speak.isFinished).to.be.false;
      expect(speak.elapsed).to.equal(2);
      speak.update(8);
      expect(speak.isFinished).to.be.true;
    });
    it('must mark itself as finished if minDuration passed and click',
      function(){
        var speak = new Speak({
          duration: 10,
          minDuration: 3
        });
        speak.actions = {
          owner: {
            game: {
              inputs: {
                cursor: {
                  isDown: true
                }
              }
            }
          }
        };
        speak.elapsed = 0;
        expect(speak.isFinished).to.be.false;
        speak.update(2);
        expect(speak.isFinished).to.be.false;
        speak.update(1.2);
        expect(speak.isFinished).to.be.true;
      }
    );
  });

  describe('#onEnd', function(){
    it('must empty the speakerText value', function(){
        var speak = new Speak();
        speak.actions = {
          owner: {
            speakerText: {
              value: 'a text'
            }
          }
        };
        speak.onEnd();

        expect(speak.actions.owner.speakerText.value).to.equal('');
    });

    it('must call after callback if set', function(){
      var speak = new Speak({
        after: sinon.stub()
      });
      speak.actions = {
        owner: {
          speakerText: {
            value: 'a text'
          }
        }
      };
      speak.onEnd();

      expect(speak.actions.owner.speakerText.value).to.equal('');
      expect(speak.after).to.have.been.calledWith(speak);
    });
  });

});
