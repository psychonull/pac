
module.exports = {
  Base: require('./Base'),
  Emitter: require('./Emitter'),
  
  Game: require('./Game'),
  create: require('./Game').create,

  runAfter: function(fn, time){
    window.setTimeout(fn, time);
  },
};
