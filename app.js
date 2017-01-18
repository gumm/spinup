
require('./public/js/linked-libs/google-closure-library/closure/goog/bootstrap/nodejs');
require('./deps.js');
goog.require('contracts.urlMap');

const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const urls = require('./routes/urls');
const app = express();


// ---------------------------------------------------------[ Settings files ]--
const mSettings = require('merge').recursive(
    require('./settings.json'),
    require('./settings_local.json'));
mSettings.version = require('./package.json').version;
mSettings.appName = require('./package.json').name;


// -----------------------------------------------------------[ Seed the app ]--
app.set('setup', mSettings); // This goes into locals.settings
console.log('\n[SETTINGS]\n', app.get('setup'));


// ----------------------------------------------------[ Standard Middleware ]--

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img/fav', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: mSettings.sessionSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// ---------------------------------------------------------------[ App URLS ]--

/**
 * Set up the urls to be used in the app.
 */
urls.setRouts(app, contracts.urlMap);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
