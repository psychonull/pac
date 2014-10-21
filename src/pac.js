
module.exports = {
  Base: require('./Base'),
  Emitter: require('./Emitter'),
  runAfter: function(fn, time){
    window.setTimeout(fn, time);
  }
};
