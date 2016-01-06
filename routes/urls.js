var routeTo = require('./basic');

module.exports = {
  /**
   * @param {Object} app
   * @param {contracts.urlMap} urlMap
   */
  setRouts: function(app, urlMap) {

    // Outside View
    app.get(urlMap.INDEX, routeTo.slash);
    app.get(urlMap.MAIN.HOME, routeTo.home);
  }
};
