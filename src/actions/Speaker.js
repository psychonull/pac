
var Action = require('../Action');
var Point = require('../Point');
var Text = require('../Text');

module.exports = Action.extend({

  name: 'Speaker',

  textOptions: {},
  offset: new Point(),
  smartPosition: true,

  init: function(options) {
    this.textOptions = (options && options.textOptions) || this.textOptions;
    this.offset = (options && options.offset) || this.offset;
    if(options && options.smartPosition === false){
      this.smartPosition = false;
    }
  },

  onStart: function() {
    var owner = this.actions.owner;
    owner.speakerText = new Text('', this.textOptions);
    //owner.speakerText.position = this.offset.add(owner.position);
    owner.speakerText.position = this.offset.clone();
    owner.children.add(owner.speakerText);
    if(this.smartPosition){
      this.fixTextPosition(owner.speakerText, owner.scene);
    }
  },

  onEnd: function() {
    var owner = this.actions.owner;
    owner.children.remove(owner.speakerText);
    delete owner.speakerText;
  },

  update: function(dt) { },

  fixTextPosition: function(text, scene){
    //TODO: check if we need game viewport size instead of scene size
    //double TODO: use text computed width instead of wordWrap
    if(!text.wordWrap){
      return;
    }
    if(text.position.x + text.wordWrap > scene.size.width){
      text.position.x = scene.size.width - text.wordWrap;
    }
    else{
      var ownerPos = this.actions.owner.position;
      text.position.x = Math.max(ownerPos.x - (text.wordWrap / 2), 0);
    }
  }

});
