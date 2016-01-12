var launch = {
  todo: null,
  permissions: null,
  initialView: null,
  user: null,
  theme: null,
  shape: null,
  landing: null,
  run: function() {
    switch (launch.todo) {
      case 'site':
        (function() {
          //noinspection JSUnresolvedVariable
          app_.site(launch.landing, launch.shape);
        })();
        break;
      default:
        console.debug('No match for', launch.todo);
    }
  },
  addApp: function(name) {
    launch.todo = name;
  },
  setShape: function(shape) {
    launch.shape = shape;
  },
  setLanding: function(landing) {
    launch.landing = landing;
  }

};


/**
 * Once the window has loaded...
 */
window.onload = launch.run;
