var DialogueOptionsBar = require('../../../src/prefabs/DialogueOptionsBar');
var Point = require('../../../src/Point');
var Text = require('../../../src/Text');
var Clickable = require('../../../src/actions/Clickable');
var Hoverable = require('../../../src/actions/Hoverable');

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('DialogueOptionsBar', function(){

  var style = {
    position: new Point(10, 20),
    margin: { x: 10, y: 5 },
    size: { width: 200, height: 40 },

    text: {
      font: '20px Arial',
      fill: '#000',
    },

    hover:{
      fill: '#111',
    },

    active: {
      fill: '#222',
    }
  };

  describe('constructor', function(){
    it('must allow to set options', function(){
      var optsBar = new DialogueOptionsBar({
        position: new Point(200, 200),
        size: { width: 500, height: 100 },
        style: style
      });
      expect(optsBar.style).to.equal(style);
      expect(optsBar.position.x).to.equal(200);
      expect(optsBar.position.y).to.equal(200);
      expect(optsBar.size.width).to.equal(500);
      expect(optsBar.size.height).to.equal(100);
      expect(optsBar.active).to.be.false;
      expect(optsBar.visible).to.be.false;
    });
  });

  describe('#showOptions', function(){
    var optsBar;

    beforeEach(function(){
      optsBar = new DialogueOptionsBar({
        position: new Point(200, 200),
        size: { width: 500, height: 100 },
        style: style
      });
    });

    it('must make itself active and visible', function(){
      expect(optsBar.active).to.be.false;
      expect(optsBar.visible).to.be.false;
      optsBar.showOptions([{code: 'x', value: 'lol'}], function(){});
      expect(optsBar.active).to.be.true;
      expect(optsBar.visible).to.be.true;
    });

    it('must set the options passed', function(){
      var options = [
        {code: 'a', value: 'hi'},
        {code: 'b', value: 'bye'}
      ],
        cb = sinon.stub();

      expect(optsBar.children.length).to.equal(0);

      optsBar.showOptions(options, cb);

      expect(optsBar.children.length).to.equal(2);

      var opt0 = optsBar.children.at(0);
      var opt1 = optsBar.children.at(1);
      expect(opt0).to.be.an.instanceof(Text);
      expect(opt0.value).to.equal(options[0].value);
      expect(opt0.code).to.equal(options[0].code);
      expect(opt1.value).to.equal(options[1].value);
      expect(opt1.code).to.equal(options[1].code);
      expect(opt0.fill).to.equal('#000');
      expect(opt0.font).to.equal('20px Arial');
      expect(opt0.actions.at(0)).to.be.instanceof(Hoverable);
      expect(opt0.actions.at(1)).to.be.instanceof(Clickable);
      expect(opt0.localPosition.x).to.equal(style.margin.x);
      expect(opt0.localPosition.y).to.equal(style.margin.y);
      expect(opt1.localPosition.x).to.equal(style.margin.x);
      expect(opt1.localPosition.y)
        .to.equal(style.margin.y * 2 + style.size.height);
      var hitbox = opt0.shape;
      expect(hitbox.size.width).to.be.equal(style.size.width);
      expect(hitbox.size.height).to.be.equal(style.size.height);
    });

    it('must subscribe to options hover and click events', function(){
      var options = [
        {code: 'a', value: 'hi'}
      ],
        cb = sinon.stub();
      sinon.spy(Text.prototype, 'on');

      optsBar.showOptions(options, cb);

      expect(Text.prototype.on).to.have.been.calledWith('hover:in');
      expect(Text.prototype.on).to.have.been.calledWith('hover:out');
      expect(Text.prototype.on).to.have.been.calledWith('click');

      Text.prototype.on.restore();
    });

    it('must set the optionSelected callback', function(){
      var options = [
        {code: 'a', value: 'hi'},
        {code: 'b', value: 'bye'}
      ],
        cb = sinon.stub();

      expect(optsBar.optionSelectedCb).to.be.null;

      optsBar.showOptions(options, cb);

      expect(optsBar.optionSelectedCb).to.equal(cb);
    });
  });

  describe('#onOptionSelected', function(){
    var optsBar,
      options = [
        {code: 'a', value: 'hi'},
        {code: 'b', value: 'bye'}
      ],
      cb = sinon.stub();

    beforeEach(function(){
      optsBar = new DialogueOptionsBar({
        position: new Point(200, 200),
        size: { width: 500, height: 100 },
        style: style
      });
      optsBar.showOptions(options, cb);
    });

    it('must mark itself as inactive and invisible', function(){
      expect(optsBar.active).to.be.true;
      expect(optsBar.visible).to.be.true;

      optsBar.onOptionSelected('a');

      expect(optsBar.active).to.be.false;
      expect(optsBar.visible).to.be.false;
    });

    it('must call the optionSelected callback passing the code', function(){
      optsBar.onOptionSelected('a');
      expect(cb).to.have.been.calledWith('a');
    });

    it('must clear children', function(){
      optsBar.onOptionSelected('a');
      expect(optsBar.children.length).to.equal(0);
    });
  });

  describe('#onOptionHoverIn #onOptionHoverOut', function(){
    var optsBar;

    beforeEach(function(){
      optsBar = new DialogueOptionsBar({
        position: new Point(200, 200),
        size: { width: 500, height: 100 },
        style: style
      });
    });

    it('must apply the hover style to the option', function(){
      var options = [
        {code: 'a', value: 'hi'},
        {code: 'b', value: 'bye'}
      ],
        cb = sinon.stub();
      optsBar.showOptions(options, cb);
      var opt = optsBar.children.at(0);

      expect(opt.fill).to.equal('#000');

      optsBar.onOptionHoverIn(opt);

      expect(opt.fill).to.equal('#111');

      optsBar.onOptionHoverOut(opt);

      expect(opt.fill).to.equal('#000');

    });
  });

  describe('#onOptionClick', function(){
    var optsBar;

    beforeEach(function(){
      optsBar = new DialogueOptionsBar({
        position: new Point(200, 200),
        size: { width: 500, height: 100 },
        style: style
      });
    });

    it('must call onOptionSelected passing the code', function(){
      var options = [
        {code: 'a', value: 'hi'},
        {code: 'b', value: 'bye'}
      ],
        cb = sinon.stub();
      optsBar.showOptions(options, cb);
      var opt = optsBar.children.at(0);

      sinon.stub(optsBar, 'onOptionSelected');

      optsBar.onOptionClick(opt);

      expect(optsBar.onOptionSelected).to.have.been.calledWith('a');

    });
  });

});
