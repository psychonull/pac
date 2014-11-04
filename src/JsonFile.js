
var Asset = require('./Asset');
var request = require('request');
var _ = require('./utils');

module.exports = Asset.extend({

  init: function(options){

    this.constructor.__super__.init.call(this, options);

    if(!this.url){
      throw new Error('Expected an URL');
    }

    this._data = null;

  },

  load: function(){
    request.get(this.url, _.bind(function(err, response, body) {

      if(err || Math.floor(response.status / 100) !== 2){
        return this.onerror(err || {
          status: response.status,
          message: response.statusText
         });
      }

      this._data = body;
      this.onload();

    }, this));
  },

  raw: function(){
    if(!this._data){
      return null;
    }
    return JSON.parse(this._data);
  }

});
