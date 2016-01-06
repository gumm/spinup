var helper = require('./helper');

module.exports = {

  /**
   * The site root.
   * @param req
   * @param res
   */
  slash: function(req, res) {
    var setup = req.app.get('setup');
    var initDetail = {
      title: setup.title,
      theme: setup.theme,
      version: setup.version,
      appName: setup.appName
    };

    if (setup['jsIsCompiled']) {
      initDetail.jsCompiled = 'compiled/' +
          setup.appName +'.min.' + setup.version + '.js';
    }
    res.render('index', initDetail);
  },

  /**
   * The non-logged in main page.
   * @param req
   * @param res
   */
  home: function(req, res) {
    var app = req.app;
    res.render('home', {title: app.get('title')});
  }

};
