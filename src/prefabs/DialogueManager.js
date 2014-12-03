
var Emitter = require('../Emitter');
var List = require('../List');
var Speak = require('../actions/Speak');
var _ = require('../utils');

var DialogueManager = Emitter.extend({

  rootDialogue: null,
  characters: null,
  currentDialogue: null,
  currentIndex: -1,
  dialogueOptionsBar: null,
  speakClass: Speak,

  constructor: function(options){
    if(options){
      this.setDialogue(options);
    }
    Emitter.apply(this, arguments);
  },

  setDialogue: function(dialogue){
    if(!dialogue.characters){
      throw new Error('No characters provided');
    }
    if(!dialogue.dialogue){
      throw new Error('No dialogue provided');
    }
    if(!dialogue.dialogueOptionsBar){
      throw new Error('No dialogueOptionsBar provided');
    }
    this.rootDialogue = DialogueManager.transformConfig(dialogue.dialogue);
    this.currentDialogue = this.rootDialogue;
    this.characters = dialogue.characters;
    this.dialogueOptionsBar = dialogue.dialogueOptionsBar;
    this.currentIndex = -1;
    this.speakClass = dialogue.speakClass || this.speakClass;
  },

  say: function(dialogueUnit){
    var owner = this.characters[dialogueUnit.owner];
    if(!owner){
      throw new Error('Unknown dialogue owner');
    }
    var text;
    if(dialogueUnit.random){
      text = _.sample(dialogueUnit.random);
    }
    else {
      text = dialogueUnit.value;
    }
    owner.actions.pushBack(new this.speakClass({
      text: text,
      after: _.bind(this.next, this)
    }));
  },

  showOptions: function(optionsUnit){
    var options = _.map(optionsUnit.options._items, function(opt){
      return _.pick(opt, ['code', 'value']);
    });
    this.dialogueOptionsBar.showOptions(
      options,
      _.bind(this.onOptionSelected, this)
    );
  },

  next: function(){
    var prevDialogueUnit = this.currentDialogue.at(this.currentIndex);
    if(prevDialogueUnit && prevDialogueUnit.options){
      throw new Error('Cannot call next when in options mode');
    }
    this.currentIndex++;
    var dialogueUnit = this.currentDialogue.at(this.currentIndex);
    if(!dialogueUnit){
      this.currentIndex--;
      this.end();
      return;
    }
    if(dialogueUnit.options){
      this.showOptions(dialogueUnit);
    }
    else {
      this.say(dialogueUnit);
    }
  },

  onOptionSelected: function(code){
    var optionSelected = this.currentDialogue.at(this.currentIndex)
                          .options.findOne({code: code});
    if(!optionSelected){
      throw new Error('Invalid option');
    }
    this.currentDialogue = optionSelected.dialogue || new List();
    this.currentIndex = -1;
    this.next();
  },

  end: function(){
    this.emit('end');
    this.currentDialogue = this.rootDialogue;
    this.currentIndex = -1;
  },

  get: function(code){
    var _get = function(dialogue, code){
      var dialogueUnit = dialogue.findOne({code: code});
      if(!dialogueUnit){
        dialogue.each(function(du){
          if(du.options){
            du.options.each(function(op){
              if(op.dialogue){
                dialogueUnit = _get(op.dialogue, code);
                if(dialogueUnit){
                  return false;
                }
              }
            });
            if(dialogueUnit){
              return false;
            }
          }
        });
      }
      return dialogueUnit;
    };

    return _get(this.rootDialogue, code);
  }

},
{

  transformConfig: function(dialogueConfig){
    var result = new List(dialogueConfig);
    result.each(function(dialogueUnit){
      if(dialogueUnit.options){
        dialogueUnit.options = new List(dialogueUnit.options);
        dialogueUnit.options.each(function(opt){
          if(opt.dialogue){
            opt.dialogue = DialogueManager.transformConfig(
              opt.dialogue
            );
          }
        });
      }
    });
    return result;
  }

});


module.exports = DialogueManager;
