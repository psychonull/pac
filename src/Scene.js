
var Emitter = require('./Emitter');

var required = ['name', 'size'];

module.exports = Emitter.extend({

  name: null,
  size: null,

  init: function(options){

    if (!options){
      throw new Error('Cannot create an empty Scene: required ' +
        required.join(', '));
    }

    required.forEach(function(req){

      if (!options.hasOwnProperty(req)) {
        throw new Error('Cannot create scene ' + (this.name || '') +
          ': "' + req + '" is required');
      }

      this[req] = options[req];

    }, this);

  }

});
