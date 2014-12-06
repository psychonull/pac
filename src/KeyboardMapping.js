/*
* Map from keyCode to key
*/

var _ = require('./utils.js');

var mappings = {};

var SPECIAL_KEYS = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  224: 'meta'
};

/**
* f1 - f19
*/
for (var i = 1; i < 20; ++i) {
  mappings[111 + i] = 'f' + i;
}

/**
* numbers on the numeric keypad
*/
for (i = 0; i <= 9; ++i) {
  mappings[i + 96] = i.toString();
}

/**
* numbers
*/
for (i = 0; i <= 9; ++i) {
  mappings[i + 48] = i.toString();
}

/**
* letters
*/
for (i = 0; i <= 25; ++i) {
  mappings[i + 65] = String.fromCharCode(i + 65);
}

_.extend(mappings, SPECIAL_KEYS);

module.exports = mappings;
