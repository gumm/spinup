goog.provide('entry');

goog.require('app.Conductor');
goog.require('app.Layout');
goog.require('bad.Net');
goog.require('goog.net.XhrManager');


/**
 * Init the site
 * @param {string=} opt_landing Where the site should land.
 */
entry.initSite = function(opt_landing) {

  /**
   * @type {!bad.Net}
   */
  var xMan = new bad.Net(new goog.net.XhrManager(0, null, 1, 6, 0));

  /**
   * A manager that collects and acts on events from views.
   * @type {app.Conductor}
   */
  var conductor = new app.Conductor(opt_landing);

  /**
   * Once the layout is ready, it fires a final layout ready event that
   * brings us here.
   * @param {bad.ui.Layout} layout
   */
  var onLayoutReady = function(layout) {
    conductor.setXMan(xMan);
    conductor.setLayout(layout);
    conductor.goLand();
  };

  /**
   * @type {app.Layout}
   */
  var layout = new app.Layout();
  layout.initLayout(onLayoutReady);
};


/**
 * @type {Object}
 */
entry.init = {
  'site': entry.initSite
};
goog.exportSymbol('app_', entry.init);


