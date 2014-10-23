
module.exports = {
  Base: require('./Base'),
  Emitter: require('./Emitter'),

  Scene: require('./Scene'),

  Stage: require('./Stage'),
  Renderer: require('./Renderer'),
  Loader: require('./Loader'),

  NativeRenderer: require('./NativeRenderer'),
  PixiRenderer: require('./PixiRenderer'),

  Game: require('./Game'),
  create: require('./Game').create

};
