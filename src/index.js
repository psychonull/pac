module.exports = (function(root) {
  root = root || {};

  var previousPAC = root.pac;

  pac = require('./pac');

  pac.VERSION = require('../package.json').version;

  pac.noConflict = function() {
    root.pac = previousPAC;
    return this;
  };

  pac.DEBUG = false;

  return pac;

})(window);
