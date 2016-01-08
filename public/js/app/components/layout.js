/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Layout');

goog.require('bad.ui.Layout');
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

  var id = 'body-background';
  var mainCells = ['header', 'main', 'footer'];
  var innerCellsHorizontal = ['left', 'center', 'right'];
  var innerCellsVertical = ['top', 'mid', 'bottom'];
  var topMargin = 0;
  var rightMargin = 0;
  var bottomMargin = 0;
  var leftMargin = 0;

  /**
   * Create a new layout
   * @type {bad.ui.Layout}
   * @private
   */
  var layout = new bad.ui.Layout(id, mainCells,
      bad.ui.Layout.Orientation.VERTICAL);

  // Set the defaults for the site.
  layout.setTarget(goog.dom.getDocument().body);
  layout.setInitialSize(mainCells[0], 72);
  layout.setInitialSize(mainCells[2], 23);
  layout.setDraggerThickness(0);
  layout.setWidthToViewport(true);
  layout.setHeightToViewport(true);
  layout.setMargin(topMargin, rightMargin, bottomMargin, leftMargin);

  /**
   * Create main horizontal layout.
   * @type {bad.ui.Layout}
   */
  var mainHorizontalLayout = layout.setInnerLayout(
      innerCellsHorizontal,
      mainCells[1],
      bad.ui.Layout.Orientation.HORIZONTAL);
  mainHorizontalLayout.setDraggerThickness(5);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 220);
  mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 220);

  /**
   * Up-Down Layout in the left.
   * @type {bad.ui.Layout}
   */
  var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(
      innerCellsVertical,
      innerCellsHorizontal[0],
      bad.ui.Layout.Orientation.VERTICAL);
  leftVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  leftVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Up-Down Layout in the right.
   * @type {bad.ui.Layout}
   */
  var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(
      innerCellsVertical,
      innerCellsHorizontal[2],
      bad.ui.Layout.Orientation.VERTICAL);
  rightVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
  rightVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

  /**
   * Each if the internal layouts will fire a LAYOUT_READY event, and all
   * of those events bubble to this_layout_. Only when all the internal
   * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
   * So if we just want to react the this.layout_, then we need to
   * check the target id of all events, and simply act when it is the same
   * as this.layout_'s id.
   */
  this.listen(layout, bad.ui.Layout.EventType.LAYOUT_READY, function(e) {
    if (e.target.getId() === id) {
      callback(layout);
    }
  });

  // Create the layout in the DOM
  layout.render();
};
