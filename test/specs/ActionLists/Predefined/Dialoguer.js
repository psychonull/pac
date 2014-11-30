
var pac = require('../../../../src/pac');
var _ = require('../../../../src/utils');
var Dialoguer = require('../../../../src/actions/Dialoguer');
var Commander = require('../../../../src/actions/Commander');
var DialogueManager = require('../../../../src/prefabs/DialogueManager');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Dialoguer', function(){

  it('must initialize with options', function(){
    var options = {
      characters: {},
      dialogue: [],
      dialogueOptionsBar: {},
      command: 'conversate'
    };

    var dialoguer = new Dialoguer();
    expect(dialoguer.options).to.be.null;
    expect(dialoguer.command).to.equal('talkto');

    dialoguer = new Dialoguer(options);
    expect(dialoguer.options).to.equal(options);
    expect(dialoguer.command).to.equal('conversate');
    expect(dialoguer.isRunning).to.be.false;
  });

  it('must require Commander', function(){
    expect(Dialoguer.prototype.requires).to.have.length(1);
    expect(Dialoguer.prototype.requires[0]).to.equal(Commander);
  });

  describe('#onStart', function(){
    var dialoguer,
      owner = {
      };

    beforeEach(function(){
      dialoguer = new Dialoguer({
        characters: {
          player: owner
        },
        dialogue: [],
        dialogueOptionsBar: {
          showOptions: function(){}
        },
        command: 'customcommand'
      });
      dialoguer.actions = {
        owner: owner
      };
    });

    it('must inject a dialogueManager into the owner',
      function(){

        dialoguer.onStart();
        expect(dialoguer.actions.owner.dialogue)
          .to.be.an.instanceof(DialogueManager);
      }
    );

    it('must find and pass the optionsBar to dialogueManager if not provided',
      function(){
        var options = {
          characters: {},
          dialogue: [],
          command: 'conversate'
        };
        var optionsBar = {};
        var game = {
          findOne: sinon.stub().returns(optionsBar)
        };
        var owner = {
          game: game
        };
        var dialoguer = new Dialoguer(options);
        dialoguer.actions = {
          owner: owner
        };
        dialoguer.onStart();
        expect(game.findOne).to.have.been.calledWith('DialogueOptionsBar');
        expect(dialoguer.actions.owner.dialogue.dialogueOptionsBar)
          .to.equal(optionsBar);
      }
    );

    it('must inject the command handler to owner onCommand',
      function(){
        var expectedFn = function(){};
        sinon.stub(_, 'bind').returns(expectedFn);

        dialoguer.onStart();

        expect(_.bind).to.have.been
          .calledWith(dialoguer.onDialogueCommand, dialoguer);
        expect(dialoguer.actions.owner.onCommand.customcommand)
          .to.equal(expectedFn);

        _.bind.restore();
      }
    );

    it('must subscribe to the dialogueManager end',
      function(){
        sinon.spy(DialogueManager.prototype, 'on');

        dialoguer.onStart();
        expect(dialoguer.actions.owner.dialogue.on)
          .to.have.been.calledWith('end');
        dialoguer.isRunning = true;

        dialoguer.actions.owner.dialogue.emit('end');

        expect(dialoguer.isRunning).to.be.false;

        DialogueManager.prototype.on.restore();
      }
    );


  });

  describe('#onEnd', function(){
    var dialoguer,
      owner = {
      };

    beforeEach(function(){
      dialoguer = new Dialoguer({
        characters: {
          player: owner
        },
        dialogue: [],
        dialogueOptionsBar: {
          showOptions: function(){}
        }
      });
      dialoguer.actions = {
        owner: owner
      };
      dialoguer.actions.owner.dialogue = {};
      dialoguer.actions.owner.onCommand = { talkto: function(){} };
    });

    it('must remove the dialogue from owner', function(){
      expect(dialoguer.actions.owner.dialogue).to.be.ok;

      dialoguer.onEnd();

      expect(dialoguer.actions.owner.dialogue).to.be.undefined;
    });

    it('must remove the onCommand handler', function(){
      dialoguer.onEnd();

      expect(dialoguer.actions.owner.onCommand.talkto).to.be.undefined;
    });

  });

  describe('#onDialogueCommand', function(){
    var dialoguer,
      owner = {
      };

    beforeEach(function(){
      dialoguer = new Dialoguer({
        characters: {
          player: owner
        },
        dialogue: [],
        dialogueOptionsBar: {
          showOptions: function(){}
        }
      });
      dialoguer.actions = {
        owner: owner
      };
      dialoguer.actions.owner.dialogue = {
        next: sinon.spy()
      };
    });

    it('must call owner.dialogue.next()', function(){
      dialoguer.onDialogueCommand();
      expect(dialoguer.actions.owner.dialogue.next).to.have.been.called;
    });

    it('must set isRunning to true', function(){
      dialoguer.onDialogueCommand();
      expect(dialoguer.isRunning).to.be.true;
    });

    it('must not call owner.dialogue if isRunning', function(){
      dialoguer.isRunning = true;
      dialoguer.onDialogueCommand();
      expect(dialoguer.actions.owner.dialogue.next).to.not.have.been.called;
    });
  });

});
