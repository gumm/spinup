goog.provide('app.Conductor');

goog.require('app.base.ViewEventType');
goog.require('app.base.view.Home');
goog.require('bad.UserManager');
goog.require('bad.ui.View');
goog.require('goog.array');
goog.require('goog.object');



/**
 * @param {string=} opt_landing Pass in optional behavior, such as when a
 *      password is being reset.
 * @constructor
 * @extends {bad.ui.View}
 */
app.Conductor = function(opt_landing) {
  bad.ui.View.call(this);

  /**
   * @type {!string}
   * @private
   */
  this.landing_ = opt_landing || 'home';

  this.listOfViewEvents_ = [];
  goog.object.forEach(app.base.ViewEventType, function(v) {
    this.listOfViewEvents_.push(v);
  }, this);

  /**
   * @type {!bad.UserManager}
   * @private
   */
  this.user_ = new bad.UserManager();
};
goog.inherits(app.Conductor, bad.ui.View);


/**
 * @type {!Map}
 */
app.Conductor.viewNameMap = new Map();
app.Conductor.viewNameMap.set('home', app.base.ViewEventType.VIEW_HOME);


/**
 * Shortcut to the landing view.
 */
app.Conductor.prototype.goLand = function() {
  //this.hideAllNests();
  this.selectView_(
      /** @type {!string} */ (app.Conductor.viewNameMap.get(this.landing_)));
};


/**
 * @param {!bad.ui.ViewEvent} e Event object.
 */
app.Conductor.prototype.onViewAction = function(e) {
  this.selectView_(e.type, e.data);
};


/**
 * @param {!string} viewEventType
 * @param {Object=} opt_data
 * @private
 */
app.Conductor.prototype.selectView_ = function(viewEventType, opt_data) {
  switch (viewEventType) {
    case app.base.ViewEventType.VIEW_HOME:
      this.viewHome();
      break;
    default:
      console.debug('No match for:', viewEventType);
  }
};


/**
 * Make the given view active.
 * @param {bad.ui.View} view
 */
app.Conductor.prototype.setActiveView = function(view) {
  this.activeView_ = view;

  this.getHandler().listen(
      this.activeView_,
      this.listOfViewEvents_,
      this.onViewAction
  );
};


//-------------------------------------------------------------------[ Views ]--
/**
 * The default view to land on.
 */
app.Conductor.prototype.viewHome = function() {
  /**
   * @type {app.base.view.Home}
   */
  var view = new app.base.view.Home();
  this.switchView(view);
};


//---------------------------------------------------------[ Views Utilities ]--
/**
 * @param {!bad.ui.View} view
 */
app.Conductor.prototype.switchView = function(view) {
  var layout = this.getLayout();
  var xMan = this.getXMan();
  if (layout && xMan) {
    if (this.activeView_) {
      this.activeView_.dispose();
    }
    this.activeView_ = view;
    this.setActiveView(this.activeView_);
    this.activeView_.setLayout(layout);
    this.activeView_.setXMan(xMan);
    this.activeView_.setUser(this.user_);
    this.activeView_.render();
  } else {
    throw 'Can not switch views. The layout is undefined.';
  }
};


/**
 * Hide all the nests. Presents a single panel.
 */
app.Conductor.prototype.hideAllNests = function() {
  var layout = this.getLayout();
  if (layout) {
    /**
     * @type {Array}
     */
    var nests = [
      layout.getNest('main', 'left'),
      layout.getNest('main', 'left', 'top'),
      layout.getNest('main', 'left', 'bottom'),
      layout.getNest('main', 'right'),
      layout.getNest('main', 'right', 'top'),
      layout.getNest('main', 'right', 'bottom')
    ];
    goog.array.forEach(nests, function(nest) {
      nest.hide();
    }, this);
  } else {
    throw 'Can not hide all nests. Layout is undefined.';
  }
};


