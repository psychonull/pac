
module.exports = {
  Base: require('./Base'),
  runAfter: function(fn, time){
    window.setTimeout(fn, time);
  }
};
