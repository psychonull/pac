
var GameObject = require('./GameObject');
var GameObjectList = require('./GameObjectList');
var Point = require('./Point');

var Drawable = module.exports = GameObject.extend({

  name: 'Drawable',
  position: null,

  layer: null,
  zIndex: 0,

  shape: null,

  // hierarchy
  children: null,
  parent: null,
  localPosition: null,

  constructor: function(opts){
    this.position = (opts && opts.position) || this.position || new Point();
    this.position = new Point(this.position);

    this.layer = (opts && opts.layer) || this.layer;
    this.zIndex = (opts && opts.zIndex) || this.zIndex;

    this.shape = (opts && opts.shape) || this.shape;

    this.children = new GameObjectList();
    this.children.on('add', this._initChild.bind(this));

    GameObject.apply(this, arguments);
  },

  _initChild: function(child){
    child.parent = this;
    child.localPosition = child.position;
    child.position = this.position.add(child.position);

    child.game = this.game;
    child.scene = this.scene;
  },

  updateHierarchy: function(dt){
    if (this.parent){
      this.position = this.parent.position.add(this.localPosition);

      this.game = this.parent.game;
      this.scene = this.parent.scene;
    }

    if (this.children){
      this.children.each(function(child){

        if (child.updateHierarchy){
          child.updateHierarchy(dt);
        }

        child.updateActions(dt);
        child.update(dt);

        if (child.updateAnimations){
          child.updateAnimations(dt);
        }
      });
    }
  },

  init: function(){ },

  update: function(dt) { }

});

