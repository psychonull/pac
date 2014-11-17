
var Action = require('../Action');
var Point = require('../Point');
var Text = require('../Text');

module.exports = Action.extend({

  textOptions: {},
  offset: new Point(),

  init: function(options) {
    this.textOptions = (options && options.textOptions) || this.textOptions;
    this.offset = (options && options.offset) || this.offset;
  },

  onStart: function() {
    var owner = this.actions.owner;
    owner.speakerText = new Text('', this.textOptions);
    //owner.speakerText.position = this.offset.add(owner.position);
    owner.speakerText.position = this.offset.clone();
    owner.children.add(owner.speakerText);
  },

  onEnd: function() {
    var owner = this.actions.owner;
    owner.children.remove(owner.speakerText);
    delete owner.speakerText;
  },

  update: function(dt) { }

});
