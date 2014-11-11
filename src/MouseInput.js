
var Input = require('./Input');
var _ = require('./utils');
var Point = require('./Point');

module.exports = Input.extend({

  init: function(options) {
    if (!this.container){
      throw new Error('Expected a container');
    }

    this._attachEvents();
  },

  _attachEvents: function(){
    if (this.events){
      this._clearEvents();
    }

    this.events = {
      mouseup: this._onmouseup.bind(this),
      mousedown: this._onmousedown.bind(this),
      mousemove: this._onmousemove.bind(this)
    };

    _.forIn(this.events, function(event, type){
      this.container.addEventListener(type, event);
    }, this);
  },

  _clearEvents: function(){
    _.forIn(this.events, function(event, type){
      this.container.removeEventListener(type, event);
    }, this);
  },

  _onmouseup: function(e){
    if (!this.enabled) return;

    var position = this._getEventPosition(e);
    this.emit(Input.events.UP, position);
  },

  _onmousedown: function(e){
    if (!this.enabled) return;

    var position = this._getEventPosition(e);
    this.emit(Input.events.DOWN, position);
  },

  _onmousemove: function(e){
    var position = this._getEventPosition(e);
    this.emit(Input.events.MOVE, position);
  },

  _getEventPosition: function(e){
    var x = 0, y = 0,
      doc = document,
      body = doc.body,
      docEle = doc.documentElement,
      ele = this.container,
      parent = ele.parentNode || body;

    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + body.scrollLeft + docEle.scrollLeft;
      y = e.clientY + body.scrollTop + docEle.scrollTop;
    }

    x -= ele.offsetLeft + parent.offsetLeft;
    y -= ele.offsetTop + parent.offsetTop;

    x += parent.scrollLeft;
    y += parent.scrollTop;

    x = Math.round(x / this.scale);
    y = Math.round(y / this.scale);
    return new Point(x, y);
  }

});
