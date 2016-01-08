var launch = {
  todo: null,
  permissions: null,
  initialView: null,
  user: null,
  theme: null,
  run: function() {
    switch (launch.todo) {
      case 'site':
        (function() {
          //noinspection JSUnresolvedVariable
          app_.site(launch.landing);
        })();
        break;
      default:
        console.debug('No match for', launch.todo);
    }
  },
  addApp: function(name) {
    launch.todo = name;
  },
  setDefaults: function(var_args) {
    launch.landing = arguments[0];
  }
};


/**
 * Once the window has loaded...
 */
window.onload = launch.run;
