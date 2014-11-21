
var pac = require('../../../../src/pac');
var Speaker = require('../../../../src/actions/Speaker');
var Text = require('../../../../src/Text');
var Point = require('../../../../src/Point');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Speaker', function(){

  it('must initialize with options', function(){
    var talker = new Speaker();
    expect(talker.textOptions).to.eql({});
    expect(talker.offset).to.be.an.instanceof(Point);
    expect(talker.offset.x).to.equal(0);
    expect(talker.offset.y).to.equal(0);
    expect(talker.smartPosition).to.be.true;

    talker = new Speaker({
      textOptions: {
        fill: 'white'
      },
      offset: new Point(1,1),
      smartPosition: false
    });
    expect(talker.textOptions.fill).to.equal('white');
    expect(talker.offset.x).to.equal(1);
    expect(talker.offset.y).to.equal(1);
    expect(talker.smartPosition).to.be.false;
  });

  describe('#onStart', function(){
    var talker,
      owner = {
        scene: {
          addObject: function(){},
          size: {
            width: 200,
            height: 200
          }
        },
        position: {
          x: 100,
          y: 100
        },
        children: {
          add: function(){}
        }
      };

    beforeEach(function(){
      talker = new Speaker({
        smartPosition: false
      });
      talker.actions = {
        owner: owner
      };
    });

    it('must create an empty text, set to the owner, and add it to children',
      function(){
        sinon.spy(owner.scene, 'addObject');
        sinon.spy(owner.children, 'add');
        talker.textOptions = { fill: 'white' };
        talker.onStart();
        expect(owner.children.add).to.have.been.called;
        expect(owner.speakerText).to.be.an.instanceof(Text);
        expect(owner.speakerText.value).to.equal('');
        expect(owner.speakerText.fill).to.equal('white');
      }
    );

    it('must set the position relative to its owner', function(){
      talker.offset = new Point(0, -20);
      talker.onStart();
      expect(owner.speakerText.position.x).to.equal(talker.offset.x);
      expect(owner.speakerText.position.y).to.equal(talker.offset.y);
    });

    it('should call fixTextPosition if smartPosition is true', function(){
      talker.smartPosition = true;
      sinon.stub(talker, 'fixTextPosition');

      talker.onStart();
      
      expect(talker.fixTextPosition).to.have.been
      .calledWith(talker.actions.owner.speakerText, talker.actions.owner.scene);
    });

  });

  describe('#onEnd', function(){
    var owner, talker;

    beforeEach(function(){
      owner = {
        children: {
          remove: function(){}
        },
        speakerText: {}
      };
      talker = new Speaker();
      talker.actions = {
        owner: owner
      };
    });

    it('must remove the text from owner children', function(){
      sinon.spy(owner.children, 'remove');
      var speakerText = {value: 'mock'};
      owner.speakerText = speakerText;
      talker.onEnd();
      expect(owner.children.remove).to.have.been.calledWith(speakerText);
    });

    it('must remove the text from the owner', function(){

      talker.onEnd();
      expect(owner.speakerText).to.be.undefined;


    });
  });

  describe('#fixTextPosition', function(){
    var owner, talker;
    var scene = {
      size: {
        width: 320,
        height: 200
      }
    };

    beforeEach(function(){
      owner = {
        position: new Point(150, 100),
        children: {
        },
        speakerText: new Text({
          position: new Point(300, 150)
        })
      };
      talker = new Speaker();
      talker.actions = {
        owner: owner
      };
    });

    it('should leave position as it is if text has no wordWrap', function(){
      talker.fixTextPosition(talker.actions.owner.speakerText, scene);
      expect(talker.actions.owner.speakerText.position.x).to.equal(300);
      expect(talker.actions.owner.speakerText.position.y).to.equal(150);
    });

    it('should fit the text in the screen if it has wordWrap and overflows',
      function(){
        talker.actions.owner.speakerText.wordWrap = 100;
        talker.fixTextPosition(talker.actions.owner.speakerText, scene);
        expect(talker.actions.owner.speakerText.position.x).to.equal(220);
        expect(talker.actions.owner.speakerText.position.y).to.equal(150);
      }
    );

    it('should center the text to the owner if it is fitting ok', function(){
      talker.actions.owner.speakerText.wordWrap = 100;
      talker.actions.owner.speakerText.position.x =
        talker.actions.owner.position.x;
      talker.fixTextPosition(talker.actions.owner.speakerText, scene);
      expect(talker.actions.owner.speakerText.position.x).to.equal(100);
      expect(talker.actions.owner.speakerText.position.y).to.equal(150);
    });

    it('should not go x negative to center text to owner', function(){
      talker.actions.owner.speakerText.wordWrap = 100;
      talker.actions.owner.position.x = 20;
      talker.actions.owner.speakerText.position.x =
        talker.actions.owner.position.x;
      talker.fixTextPosition(talker.actions.owner.speakerText, scene);
      expect(talker.actions.owner.speakerText.position.x).to.equal(0);
      expect(talker.actions.owner.speakerText.position.y).to.equal(150);
    });

  });

});
