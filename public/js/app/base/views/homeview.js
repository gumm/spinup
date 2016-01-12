goog.provide('app.base.view.Home');

goog.require('app.base.panel.Main');
goog.require('bad.ui.EventType');
goog.require('bad.ui.View');
goog.require('contracts.urlMap');
goog.require('goog.Uri');



/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Home = function() {
  bad.ui.View.call(this);
};
goog.inherits(app.base.view.Home, bad.ui.View);


/**
 * Configure the panels that is managed by this view.
 */
app.base.view.Home.prototype.configurePanels = function() {
  /**
   * @type {bad.ui.Layout}
   */
  var layout = this.getLayout();

  /**
   * @type {bad.UserManager}
   */
  var user = this.getUser();

  /**
   * @type {app.base.panel.Main}
   */
  //this.panA = this.createPanelA_(layout, user);
};


/**
 * @param {bad.ui.Layout} layout
 * @param {bad.UserManager} user
 * @return {app.base.panel.Main}
 * @private
 */
app.base.view.Home.prototype.createPanelA_ = function(layout, user) {
  var panA = new app.base.panel.Main();
  panA.setUri(new goog.Uri(contracts.urlMap.MAIN.HOME));
  panA.setUser(user);
  panA.setNestAsTarget(layout.getNest('main', 'center'));
  panA.setBeforeReadyCallback(goog.bind(
      panA.dispatchActionEvent, panA, 'MAIN_READY'));
  this.addPanelToView('home', panA);
  return panA;
};


/**
 * Entry point once the view is ready. Renders the panels.
 */
app.base.view.Home.prototype.displayPanels = function() {
  this.panA ? this.panA.renderWithTemplate() : goog.nullFunction();
};


/**
 * @param {bad.ActionEvent} e Event object.
 */
app.base.view.Home.prototype.onPanelAction = function(e) {
  var panel = /** @type {bad.ui.Panel} */(e.target);
  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {

    case bad.ui.EventType.READY:
      console.debug('SIMPLE PANEL READY', panel);
      break;

    case 'MAIN_READY':
      console.debug('MAIN Panel Ready', panel);
      break;

    default:
      console.debug('NO ACTION', value, data);
      goog.nullFunction();
  }
};
