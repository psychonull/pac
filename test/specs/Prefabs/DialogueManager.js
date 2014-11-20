
var pac = require('../../../src/pac');
var GameObject = require('../../../src/GameObject');
var Speak = require('../../../src/actions/Speak');
var List = require('../../../src/List');
var DialogueManager = require('../../../src/prefabs/DialogueManager');
var _ = require('../../../src/utils');

var chai = require('chai');
var expect = chai.expect;

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);


var player = new GameObject({actions:[]}),
  b = new GameObject({actions:[]});
var defaultChars = {
  'player': player,
  'b': b
};
var dialogueOptionsBarMock = {
  showOptions: sinon.stub()
};

var simpleDialogue = [
  {
    value: 'Hola.',
    owner: 'player'
  },
  {
    value: 'Hola!!',
    owner: 'b'
  }
];

describe('DialogueManager', function(){

  it('must expose pac.prefabs.DialogueManager', function(){
    expect(pac.prefabs.DialogueManager).to.be.a('function');
    expect(pac.prefabs.DialogueManager.prototype)
      .to.be.an.instanceof(pac.Emitter);
  });

  describe('Constructor', function(){

    it('must call setDialogue if options is provided', function(){
      var validDialogue = { lol: 'fake' };
      sinon.stub(DialogueManager.prototype, 'setDialogue');

      var dialogue1 = new DialogueManager();
      expect(dialogue1.setDialogue).to.not.have.been.called;

      var dialogue2 = new DialogueManager(validDialogue);
      expect(dialogue2.setDialogue).to.have.been.calledWith(validDialogue);

      DialogueManager.prototype.setDialogue.restore();
    });
  });

  describe('Methods', function(){
    describe('#setDialogue', function(){
      var dialogue;

      beforeEach(function(){
        dialogue = new DialogueManager({
          characters: {},
          dialogue: [],
          dialogueOptionsBar: {}
        });
      });

      it('must require characters, dialogue and dialogOptionsBar fields',
        function(){
          expect(function(){
            dialogue.setDialogue({});
          }).to.throw(/No characters provided/i);

          expect(function(){
            dialogue.setDialogue({characters:{}});
          }).to.throw(/No dialogue provided/i);


          expect(function(){
            dialogue.setDialogue({characters:{}, dialogue:[]});
          }).to.throw(/No dialogueOptionsBar provided/i);
        }
      );

      it('must require characters to be Speakers?');

      it('must call validate() that returns if the dialogue is valid');

      it('must set rootDialogue, currentDialogue, and characters fields',
        function(){
          var data = [],
            characters = {},
            dialogueOptionsBar = {};

          sinon.spy(DialogueManager, 'transformConfig');

          dialogue.setDialogue({
            characters: characters,
            dialogue: data,
            dialogueOptionsBar: dialogueOptionsBar
          });

          expect(DialogueManager.transformConfig).to.have.been.calledWith(data);
          expect(dialogue.rootDialogue).to.be.an.instanceof(List);
          expect(dialogue.currentDialogue).to.equal(dialogue.rootDialogue);
          expect(dialogue.characters).to.equal(characters);
          expect(dialogue.currentIndex).to.equal(-1);
          expect(dialogue.dialogueOptionsBar).to.equal(dialogueOptionsBar);
        }
      );
    });

    describe('#say', function(){
      var dialogue = new DialogueManager({
        characters: defaultChars,
        dialogue: simpleDialogue,
        dialogueOptionsBar: {}
      });

      afterEach(function(){
        player.actions.removeAll(Speak);
      });

      it('must throw an error if owner is not in characters', function(){
        expect(function(){
          dialogue.say({
            value: 'lalal',
            owner: 'error'
          });
        }).to.throw(/unknown dialogue owner/i);
      });

      it('must add Speak for that owner character with the values passed',
        function(){
          dialogue.say({
            value: 'xD',
            owner: 'player'
          });

          expect(player.actions.length).to.equal(1);
          expect(player.actions.at(0)).to.be.an.instanceof(Speak);
          expect(player.actions.at(0).text).to.equal('xD');
        }
      );

      it('must add Speak with random text when no value but random is present',
        function(){
          sinon.stub(_, 'sample').returns('xD2');

          dialogue.say({
            random: ['xD', 'xD2'],
            owner: 'player'
          });

          expect(_.sample).to.have.been.calledWithMatch(['xD', 'xD2']);
          expect(player.actions.at(0).text).to.equal('xD2');

          _.sample.restore();
        }
      );

      it('must add Speak with 0 duration when no text is provided');
    });

    describe('#showOptions', function(){
      it('must call showOptions on the dialogueOptionsBar', function(){
        var dialogueWithOptions = [
          {
            code: 'opt1',
            options: [
              {
                code: 'A',
                value: 'Como estás?',
                dialogue: [{
                  value: 'jejeje',
                  owner: 'player'
                }]
              },
              {
                code: 'B',
                value: 'ya me iba.'
              }
            ]
          }
        ];

        var expectedFn = function(){};
        sinon.stub(_, 'bind').returns(expectedFn);

        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: dialogueWithOptions,
          dialogueOptionsBar: dialogueOptionsBarMock
        });

        dialogue.showOptions(dialogueWithOptions[0]);

        var expectedOptions = [{
          code: 'A',
          value: 'Como estás?'
        },
        {
          code: 'B',
          value: 'ya me iba.',
        }];
        expect(dialogueOptionsBarMock.showOptions)
          .to.have.been.calledWithMatch(expectedOptions, function(v){
            return v === expectedFn;
          });
        expect(_.bind)
          .to.have.been.calledWith(dialogue.onOptionSelected, dialogue);

        _.bind.restore();
      });
    });

    describe('#next', function(){
      var dialogue;
      beforeEach(function(){
        dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: simpleDialogue,
          dialogueOptionsBar: {}
        });
      });

      it('must call say with the next dialogue value',
        function(){
          sinon.stub(dialogue, 'say');

          dialogue.next();
          expect(dialogue.say).to.have.been.calledWith(simpleDialogue[0]);
        }
      );

      it('must increment the currentIndex', function(){
        sinon.stub(dialogue, 'say');

        dialogue.next();
        dialogue.next();

        expect(dialogue.say).to.have.been.calledWith(simpleDialogue[0]);
        expect(dialogue.say).to.have.been.calledWith(simpleDialogue[1]);
        expect(dialogue.currentIndex).to.equal(1);
      });

      it('must call showOptions with the next node if an options node',
        function(){
          var dialogueWithOptions = [
            {
              code: 'opt1',
              options: [
                {
                  code: 'A',
                  value: 'Como estás?',
                  dialogue: [{
                    value: 'jejeje',
                    owner: 'player'
                  }]
                },
                {
                  code: 'B',
                  value: 'ya me iba.',
                }
              ]
            }
          ];
          var dialogue = new DialogueManager({
            characters: defaultChars,
            dialogue: dialogueWithOptions,
            dialogueOptionsBar: {}
          });

          sinon.stub(dialogue, 'showOptions');

          dialogue.next();
          expect(dialogue.showOptions)
            .to.have.been.calledWith(dialogueWithOptions[0]);
          expect(dialogue.currentIndex).to.equal(0);
        }
      );

      it('must throw error when in an options node', function(){
        var dialogueWithOptions = [
          {
            code: 'opt1',
            options: [
              {
                code: 'A',
                value: 'Como estás?',
                dialogue: [{
                  value: 'jejeje',
                  owner: 'player'
                }]
              },
              {
                code: 'B',
                value: 'ya me iba.',
              }
            ]
          }
        ];

        var testDialogue = dialogueWithOptions.concat([{
          value: 'lulz',
          owner: 'player'
        }]);
        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: testDialogue,
          dialogueOptionsBar: {}
        });

        sinon.stub(dialogue, 'showOptions');
        sinon.stub(dialogue, 'say');
        dialogue.next();

        expect(function(){
          dialogue.next();
        }).to.throw(/Cannot call next when in options mode/i);
      });

      it('must call end when no more conversation nodes', function(){
        var testDialogue = [{
          value: 'hi bye',
          owner: 'b'
        }];
        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: testDialogue,
          dialogueOptionsBar: {}
        });

        sinon.stub(dialogue, 'say');
        sinon.stub(dialogue, 'end');

        dialogue.next();
        dialogue.next();
        expect(dialogue.currentIndex).to.equal(0);
        expect(dialogue.end).to.have.been.called;
      });
    });

    describe('#onOptionSelected', function(){
      var dialogueWithOptions;

      beforeEach(function(){
        dialogueWithOptions = [
          {
            code: 'opt1',
            options: [
              {
                code: 'A',
                value: 'Como estás?',
                dialogue: [{
                  value: 'jejeje',
                  owner: 'player'
                }]
              },
              {
                code: 'B',
                value: 'ya me iba.',
              }
            ]
          }
        ];
      });

      it('must change currentDialogue, reset currentIndex and call next()',
        function(){
          var dialogue = new DialogueManager({
            characters: defaultChars,
            dialogue: dialogueWithOptions,
            dialogueOptionsBar: dialogueOptionsBarMock
          });

          sinon.stub(dialogue, 'next');

          dialogue.currentIndex = 0;

          dialogue.onOptionSelected('A');

          expect(dialogue.currentIndex).to.equal(-1);
          expect(dialogue.currentDialogue)
            .to.equal(dialogueWithOptions[0].options.at(0).dialogue);
          expect(dialogue.next).to.have.been.called;
        }
      );

      it('must set currentDialogue to an empty if there is no dialogue field',
        function(){
          var dialogue = new DialogueManager({
            characters: defaultChars,
            dialogue: dialogueWithOptions,
            dialogueOptionsBar: dialogueOptionsBarMock
          });

          sinon.stub(dialogue, 'next');

          dialogue.currentIndex = 0;

          dialogue.onOptionSelected('B');

          expect(dialogue.currentIndex).to.equal(-1);
          expect(dialogue.currentDialogue).to.be.an.instanceof(List);
          expect(dialogue.currentDialogue.length).to.equal(0);
          expect(dialogue.next).to.have.been.called;
        }
      );

      it('must throw an error in case of invalid option', function(){
        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: dialogueWithOptions,
          dialogueOptionsBar: dialogueOptionsBarMock
        });
        dialogue.currentIndex = 0;

        expect(function(){
          dialogue.onOptionSelected('C');
        }).to.throw(/Invalid option/i);
      });

    });

    describe('#goTo', function(){
      it('should seek recursively');
      it('should throw an error if there is no phrase with that code');
    });

    describe('#eval', function(){
      it('should allow to call goTo, next, end, emit');
    });

    describe('#set', function(){
      it('should allow to change any conv phrase by code');
    });

    describe('#get', function(){
      it('must return the dialogueUnit for that code (recursive)', function(){
        var nestedDialogue = {
          value: 'jejeje',
          code: 'laugh_1',
          owner: 'player'
        };
        var dialogueWithOptions = [
          {
            code: 'OP',
            value: 'lol'
          },
          {
            code: 'opt1',
            options: [
              {
                code: 'A',
                value: 'Como estás?',
                dialogue: [nestedDialogue]
              },
              {
                code: 'B',
                value: 'ya me iba.',
              }
            ]
          }
        ];
        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: dialogueWithOptions,
          dialogueOptionsBar: dialogueOptionsBarMock
        });

        expect(dialogue.get('OP').value).to.equal('lol');
        expect(dialogue.get('laugh_1')).to.equal(nestedDialogue);

      });
    });

    describe('#end', function(){
      it('must emit "end" and restart the conversation', function(){
        var dialogueWithOptions = [
          {
            code: 'opt1',
            options: [
              {
                code: 'A',
                value: 'Como estás?',
                dialogue: [{
                  value: 'jejeje',
                  owner: 'player'
                }]
              },
              {
                code: 'B',
                value: 'ya me iba.',
              }
            ]
          }
        ];
        var dialogue = new DialogueManager({
          characters: defaultChars,
          dialogue: dialogueWithOptions,
          dialogueOptionsBar: dialogueOptionsBarMock
        });
        dialogue.currentIndex = 0;
        dialogue.currentDialogue = dialogue.rootDialogue.at(0)
                                    .options.at(0).dialogue;
        sinon.spy(dialogue, 'emit');

        dialogue.end();
        expect(dialogue.emit).to.have.been.calledWith('end');
        expect(dialogue.currentIndex).to.equal(-1);
        expect(dialogue.currentDialogue).to.equal(dialogue.rootDialogue);
      });
    });

  });

  describe('Statics', function(){

    describe('transformConfig', function(){

      it('must return a List, and wrap options and dialogues in Lists',
        function(){
          var dialogueWithOptions = [
            {
              code: 'opt1',
              options: [ // opciones seleccionables
                {
                  code: 'A',
                  value: 'Como estás?',
                  dialogue: [{
                    value: 'jejeje',
                    owner: 'player'
                  }]
                },
                {
                  code: 'B',
                  value: 'ya me iba.', //termina la conversacion
                }
              ]
            }
          ];
          var result = DialogueManager.transformConfig(dialogueWithOptions);
          expect(result).to.be.an.instanceof(List);
          expect(result.at(0).options).to.be.an.instanceof(List);
          expect(result.at(0).options.at(0).dialogue).to.be.an.instanceof(List);
        }
      );

      it('must expand the conv when value is an array');

    });

  });

});
