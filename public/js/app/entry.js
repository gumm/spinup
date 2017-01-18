goog.provide('entry');

goog.require('app.Conductor');
goog.require('app.Layout');
goog.require('bad.Net');
goog.require('goog.net.XhrManager');


/**
 * Init the site
 * @param {string=} opt_landing Where the site should land.
 * @param {!Array=} opt_shape A data structure defining the shape of the site.
 */
entry.initSite = function(opt_landing, opt_shape) {

  /**
   * @type {!bad.Net}
   */
  const xMan = new bad.Net(new goog.net.XhrManager(0, null, 1, 6, 0));

  /**
   * A manager that collects and acts on events from views.
   * @type {!app.Conductor}
   */
  const conductor = new app.Conductor(opt_landing);

  /**
   * Once the layout is ready, it fires a final layout ready event that
   * brings us here.
   * @param {!bad.ui.Layout} layout
   */
  const onLayoutReady = layout => {
    conductor.setXMan(xMan);
    conductor.setLayout(layout);
    // conductor.goLand();
    console.debug(opt_landing);
  };

  /**
   * @type {!app.Layout}
   */
  const layout = new app.Layout();
  opt_shape && layout.setShape(opt_shape);
  layout.initLayout(onLayoutReady, 5, 5);
};


/**
 * @type {{site: !Function}}
 */
entry.init = {
  'site': entry.initSite
};
goog.exportSymbol('app_', entry.init);
