goog.provide('app.base.panel.Main');

goog.require('bad.ui.Panel');
goog.require('goog.dom');



/**
 * The home panel.
 * @param {!goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Main = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Main, bad.ui.Panel);


/**
 * @inheritDoc
 */
app.base.panel.Main.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  // Your shit here...
};
