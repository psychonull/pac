
(function(root, factory) {

  // Set up PAC appropriately for the environment.

  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['exports'], function(exports) {
      root.pac = factory(root, exports);
    });

  // Node.js or CommonJS. 
  } else if (typeof exports !== 'undefined') {
    factory(root, exports);

  // As a browser global.
  } else {
    root.pac = factory(root, {});
  }

}(this, function(root, pac) {
  
  var previousPAC = root.pac;

  pac = require('./pac');

  //TODO: Take this version from package.json
  pac.VERSION = '0.0.1';

  pac.noConflict = function() {
    root.pac = previousPAC;
    return this;
  };

  return pac;

}));
