
var Emitter = require('./Emitter');
var ActionList = require('./ActionList');
var GameObjectList = require('./GameObjectList');
var Point = require('./Point');

var GameObject = module.exports = Emitter.extend({

  name: 'GameObject',

  position: null,

  layer: null,
  zIndex: 0,

  shape: null,

  active: true,
  visible: true,

  actions: null,

  // hierarchy
  children: null,
  parent: null,
  localPosition: null,

  constructor: function(options){
    this._initProperties(options);
    this._initActions(options);

    this.children = new GameObjectList();
    this.children.on('add', this._initChild.bind(this));

    Emitter.apply(this, arguments);
  },

  _initProperties: function(opts){
    this.name = (opts && opts.name) || this.name;

    this.position = (opts && opts.position) || this.position || new Point();
    this.position = new Point(this.position);

    var props = [
      'layer',
      'zIndex',
      'shape'
    ];

    function setProp(prop){
      this[prop] = (opts && opts[prop]) || this[prop];
    }

    props.forEach(setProp.bind(this));

    this.active = (opts && opts.active === false) ? false : this.active;
    this.visible = (opts && opts.visible === false) ? false : this.visible;
  },

  _initActions: function(options){
    this.actions = (options && options.actions) || this.actions;

    if (this.actions){

      if (Array.isArray(this.actions)){
        this.actions = new ActionList(this.actions);
      }

      this.actions.owner = this;
    }
  },

  _initChild: function(child){
    child.parent = this;
    child.localPosition = child.position;
    child.position = this.position.add(child.position);

    child.game = this.game;
    child.scene = this.scene;
  },

  init: function(){ },

  update: function(dt) { },

  updateHierarchy: function(dt){
    if (this.parent){
      this.position = this.parent.position.add(this.localPosition);

      this.game = this.parent.game;
      this.scene = this.parent.scene;
    }

    if (this.children){
      this.children.update(dt);
    }
  },

  updateActions: function(dt) {
    if (this.actions){
      this.actions.update(dt);
    }
  },

  onEnterScene: function(){}

});

