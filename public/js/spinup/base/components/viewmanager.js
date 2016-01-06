goog.provide('app.base.ViewManager');

goog.require('app.base.ViewEventType');
goog.require('app.base.view.Home');
goog.require('bad.UserManager');
goog.require('bad.ui.View');
goog.require('contracts.urlMap');
goog.require('goog.array');
goog.require('goog.object');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.ViewManager = function() {
  bad.ui.View.call(this);

  this.listOfViewEvents_ = [];
  goog.object.forEach(app.base.ViewEventType, function(v, k) {
    this.listOfViewEvents_.push(v);
  }, this);

  /**
   * @type {bad.UserManager}
   * @private
   */
  this.user_ = new bad.UserManager();
};
goog.inherits(app.base.ViewManager, bad.ui.View);

app.base.ViewManager.prototype.onViewAction = function(e) {
  var data = e.data;
  switch (e.type) {
    case app.base.ViewEventType.VIEW_HOME:
      console.debug('data');
      this.viewHome();
      break;
    default:
      console.debug('No match for:', e.type);
  }
};


app.base.ViewManager.prototype.setActiveView = function(view) {
  this.activeView_ = view;

  this.getHandler().listen(
      this.activeView_,
      this.listOfViewEvents_,
      this.onViewAction
  );
};


//-------------------------------------------------------------------[ Views ]--
app.base.ViewManager.prototype.viewHome = function() {
  /**
   * @type {app.base.view.Home}
   */
  var view = new app.base.view.Home();
  this.switchView(view);
};

//---------------------------------------------------------[ Views Utilities ]--

/**
 * @param {bad.ui.View} view
 */
app.base.ViewManager.prototype.switchView = function(view) {
  this.hideAllNests();
  if (this.activeView_) {
    this.activeView_.dispose();
  }
  this.activeView_ = view;
  this.setActiveView(this.activeView_);
  this.activeView_.setLayout(this.layout_);
  this.activeView_.setXMan(this.xMan_);
  this.activeView_.setUser(this.user_);
  this.activeView_.render();
};


/**
 * Hide all the nests. Presents a single panel.
 */
app.base.ViewManager.prototype.hideAllNests = function() {
  /**
   * @type {Array}
   */
  var nests = [
    this.layout_.getNest('main', 'left'),
    this.layout_.getNest('main', 'left', 'top'),
    this.layout_.getNest('main', 'left', 'bottom'),
    this.layout_.getNest('main', 'right'),
    this.layout_.getNest('main', 'right', 'top'),
    this.layout_.getNest('main', 'right', 'bottom')
  ];
  goog.array.forEach(nests, function(nest) {
    nest.hide();
  }, this);
};


