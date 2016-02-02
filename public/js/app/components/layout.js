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
  this.shape_ = null;
};
goog.inherits(app.Layout, goog.events.EventHandler);


/**
 * Create the layout component.
 * @param {!function(!bad.ui.Layout):undefined} callback
 * @param {number=} opt_dtMain The main layout dragger thickness. When set to
 *  zero, the layout appears (and is functionally) static from a user
 *  perspective. Nests can still be open, closed, hidden and re-sized
 *  via the layout API. Value given in px. Default is 0.
 * @param {number=} opt_dtSub The sub-layout dragger thickness. When set to
 *  zero, the layout appears (and is functionally) static from a user
 *  perspective. Nests can still be open, closed, hidden and re-sized
 *  via the layout API. Value given in px. Default is 5.
 */
app.Layout.prototype.initLayout = function(callback, opt_dtMain, opt_dtSub) {

  var dtMain = goog.isDefAndNotNull(opt_dtMain) ? opt_dtMain : 0;
  var dtSub = goog.isDefAndNotNull(opt_dtSub) ? opt_dtSub : 5;
  var outer = this.getLayoutStructure_();
  var layout = this.parseLayoutStructure_(outer, dtMain, dtSub);

  /**
   * Each if the internal layouts will fire a LAYOUT_READY event, and all
   * of those events bubble to this_layout_. Only when all the internal
   * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
   * So if we just want to react the this.layout_, then we need to
   * check the target id of all events, and simply act when it is the same
   * as this.layout_'s id.
   */
  this.listen(layout, bad.ui.Layout.EventType.LAYOUT_READY, function(e) {
    if (e.target.getId() === outer[0]) {
      callback(layout);
    }
  });

  // Create the layout in the DOM
  layout.render();
};

app.Layout.prototype.setShape = function(shape) {
  this.shape_ = shape;
};

app.Layout.prototype.getLayoutStructure_ = function() {

  /*

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


  var result;
  if (this.shape_) {
    result = this.shape_;
  } else {
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
    result = [outerId, v, [head, main, foot]];
  }
  return result;
};


/**
 * @param {!Array} outer
 * @param {!number} dtMain The main layout dragger thickness.
 * @param {!number} dtSub The main layout dragger thickness.
 * @return {!bad.ui.Layout}
 * @private
 */
app.Layout.prototype.parseLayoutStructure_ = function(outer, dtMain, dtSub) {

  /**
   * @param {!Array} arr
   * @return {!Array}
   */
  var getNameList = function(arr) {
    return arr.map(function(item) {return item[0];});
  };

  /**
   * @param {!Array} arr
   * @param {!bad.ui.Layout} layout
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
   * @type {!bad.ui.Layout}
   */
  var mainLayout = new bad.ui.Layout(outer[0], getNameList(outer[2]), outer[1]);
  var bodyEl = goog.dom.getDocument().body;
  if (bodyEl) {
    setInitialSize(outer[2], mainLayout);
    mainLayout.setTarget(bodyEl);
    mainLayout.setDraggerThickness(dtMain);
    mainLayout.setWidthToViewport(true);
    mainLayout.setHeightToViewport(true);
    mainLayout.setMargin(0, 0, 0, 0);
  }

  /**
   * Parse the inner layouts.
   * @param {!Array} c
   * @param {!bad.ui.Layout} l
   * @return {!bad.ui.Layout}
   */
  var parseInner = function(c, l) {
    c.forEach(function(inner) {
      if (inner[1]) {
        var nameList = getNameList(inner[2]);
        var innerLayout = l.setInnerLayout(nameList, inner[0], inner[1]);
        innerLayout.setDraggerThickness(dtSub);
        setInitialSize(inner[2], innerLayout);
        parseInner(inner[2], innerLayout);
      }
    });
    return l;
  };
  return parseInner(outer[2], mainLayout);
};
