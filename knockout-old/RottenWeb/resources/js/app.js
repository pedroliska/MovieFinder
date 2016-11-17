require.config({

  baseUrl: "resources/js/lib",

  paths: {
    "app": "../app"
  },

  urlArgs: "bust=v6",
  //urlArgs: "bust=" + (new Date()).getTime(),

  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    '*': { 'jquery': 'jquery-private' },

    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    'jquery-private': { 'jquery': 'jquery' }
  }
});

// Load the main app module to start the app
requirejs(["app/main"]);
