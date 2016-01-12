var helper = require('./helper');
var shapeToLayout = require('../lib/layout/shape_to_layout');

module.exports = {

  /**
   * The site root.
   * @param req
   * @param res
   */
  slash: function(req, res) {
    var setup = req.app.get('setup');
    var shape = shapeToLayout('some_random_id', setup.shape);
    console.log(shape);
    var initDetail = {
      title: setup.title,
      theme: setup.theme,
      version: setup.version,
      appName: setup.appName,
      shape: shape
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
    res.render('main/home', {title: app.get('title')});
  }

};
