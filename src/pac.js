
module.exports = {
  Base: require('class-extend'),
  runAfter: function(fn, time){
    window.setTimeout(fn, time);
  }
};
