/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Layout');

goog.require('bad.ui.Layout');
goog.require('bad.utils');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');



/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Layout = function() {
  goog.events.EventHandler.call(this);
};
goog.inherits(app.Layout, goog.events.EventHandler);


/**
 * Create the layout component.
 * @param {function(bad.ui.Layout): *} callback
 */
app.Layout.prototype.initLayout = function(callback) {

  /*
   Here is a nice challenge: Given ASCII art like below,
   write a parser that can read that and convert it to a data structure
   like 'outer' variable below. Think something along the lines of
   Dijkstra's Shunting-yard Algorithm - or maybe something else...

   With newlines and the chrome removed, this looks like this:
   |header(72)||main|||||left(220)|center|right(220)|||||||||||top(50)||||top(50)||||||||||||mid||||mid||||||||||||bot(50)||||bot(50)||||||||||||footer(23)|

   Shunting-Yard the sit out of that!
   Split on pipe:
   ["", "header(72)", "", "main", "", "", "", "", "left(220)", "center", "right(220)", "", "", "", "", "", "", "", "", "", "", "top(50)", "", "", "", "top(50)", "", "", "", "", "", "", "", "", "", "", "", "mid", "", "", "", "mid", "", "", "", "", "", "", "", "", "", "", "", "bot(50)", "", "", "", "bot(50)", "", "", "", "", "", "", "", "", "", "", "", "footer(23)", ""]

    Split on 2 pipes:
    ["|header(72)", "main", "", "|left(220)|center|right(220)", "", "", "", "", "|top(50)", "", "top(50)", "", "", "", "", "", "mid", "", "mid", "", "", "", "", "", "bot(50)", "", "bot(50)", "", "", "", "", "", "footer(23)|"]


    "=|header(72)|=|main||===|||left(220)|center|right(220)||||=||=|||||top(50)||||top(50)|||||=||=|||||mid||||mid|||||=||=|||||bot(50)||||bot(50)|||||=||=|||===|=|footer(23)|="

    blue = blee.split('=');
    ["|header(72)|", "|main||", "|||left(220)|center|right(220)||||", "||", "|||||top(50)||||top(50)|||||", "||", "|||||mid||||mid|||||", "||", "|||||bot(50)||||bot(50)|||||", "||", "|||", "|", "|footer(23)|"]


   Horizontal Nests
   +---+---+---+
   | L | C | R |
   +---+---+---+

   Vertical Nests
   +---+
   | T |
   +---+
   | M |
   +---+
   | B |
   +---+

   +-----------------------------------------------+
   |                    header (72)                |
   +-----------------------------------------------+
   |                     main                      |
   | +--------------+-------------+--------------+ |
   | |  left (220)  |    center   |  right (220) | |
   | | +----------+ |             | +----------+ | |
   | | | top (50) | |             | | top (50) | | |
   | | +----------+ |             | +----------+ | |
   | | |    mid   | |             | |    mid   | | |
   | | +----------+ |             | +----------+ | |
   | | | bot (50) | |             | | bot (50) | | |
   | | +----------+ |             | +----------+ | |
   | +--------------+-------------+--------------+ |
   +-----------------------------------------------+
   |                    footer (23)                |
   +-----------------------------------------------+

   */

  var outerId = bad.utils.privateRandom();
  var v = bad.ui.Layout.Orientation.VERTICAL;
  var h = bad.ui.Layout.Orientation.HORIZONTAL;
  var e = null;

  // Empty Cells
  var top = ['top', e, [], 50];
  var mid = ['mid', e, []];
  var bot = ['bottom', e, [], 50];
  var head = ['header', e, [], 72];
  var foot = ['footer', e, [], 23];
  var cent = ['center', e, []];

  // Cells with inner layouts
  var left = ['left', v, [top, mid, bot], 220];
  var right = ['right', v, [top, mid, bot], 220];
  var main = ['main', h, [left, cent, right]];

  // The outer layout structure.
  var outer = [outerId, v, [head, main, foot]];
  var layout = this.parseLayoutStructure_(outer);

  /**
   * Each if the internal layouts will fire a LAYOUT_READY event, and all
   * of those events bubble to this_layout_. Only when all the internal
   * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
   * So if we just want to react the this.layout_, then we need to
   * check the target id of all events, and simply act when it is the same
   * as this.layout_'s id.
   */
  this.listen(layout, bad.ui.Layout.EventType.LAYOUT_READY, function(e) {
    if (e.target.getId() === outerId) {
      callback(layout);
    }
  });

  // Create the layout in the DOM
  layout.render();
};


/**
 * @param {Array} outer
 * @return {bad.ui.Layout}
 * @private
 */
app.Layout.prototype.parseLayoutStructure_ = function(outer) {

  /**
   * @param {Array} arr
   * @return {Array}
   */
  var getNameList = function(arr) {
    return arr.map(function(item) {return item[0];});
  };

  /**
   * @param {Array} arr
   * @param {bad.ui.Layout} layout
   */
  var setInitialSize = function(arr, layout) {
    arr.forEach(function(item) {
      if (item[3]) {
        layout.setInitialSize(item[0], item[3]);
      }
    });
  };

  /**
   * The main layout...
   * @type {bad.ui.Layout}
   */
  var mainLayout = new bad.ui.Layout(outer[0], getNameList(outer[2]), outer[1]);
  setInitialSize(outer[2], mainLayout);
  mainLayout.setTarget(goog.dom.getDocument().body);
  mainLayout.setDraggerThickness(0);
  mainLayout.setWidthToViewport(true);
  mainLayout.setHeightToViewport(true);
  mainLayout.setMargin(0, 0, 0, 0);

  /**
   * Parse the inner layouts.
   * @param {Array} c
   * @param {bad.ui.Layout} l
   * @return {bad.ui.Layout}
   */
  var parseInner = function(c, l) {
    c.forEach(function(inner) {
      if (inner[1]) {
        var nameList = getNameList(inner[2]);
        var innerLayout = l.setInnerLayout(nameList, inner[0], inner[1]);
        innerLayout.setDraggerThickness(5);
        setInitialSize(inner[2], innerLayout);
        parseInner(inner[2], innerLayout);
      }
    });
    return l;
  };
  return parseInner(outer[2], mainLayout);
};
