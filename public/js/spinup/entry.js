goog.provide('entry');

goog.require('app.Site');
goog.require('bad.Net');
goog.require('goog.net.XhrManager');

/**
 * Init the site
 */
entry.initSite = function(opt_landing) {

  var opt_maxRetries = 0,
    opt_headers = null,
    opt_minCount = 1,
    opt_maxCount = 6,
    opt_timeoutInterval = 0;

  /**
   * @type {!goog.net.XhrManager}
   */
  var xhrMan = new goog.net.XhrManager(
    opt_maxRetries,
    opt_headers,
    opt_minCount,
    opt_maxCount,
    opt_timeoutInterval);

  /**
   * @type {!bad.Net}
   */
  var xMan = new bad.Net(xhrMan);

  /**
   * @type {app.Site}
   */
  var site = new app.Site(xMan, opt_landing);
  site.initSite();
};

/**
 * @type {Object}
 * @private
 */
entry.init_ = {
  'site': entry.initSite
};
goog.exportSymbol('app_', entry.init_);


