
var List = require('./List');
var GameObject = require('./GameObject');

module.exports = List.extend({

  childType: GameObject,
  comparator: 'zIndex'

});
