requirejs.config({
    "baseUrl": "/assets/js/vendor",
    "paths": {
      "scripts": "../scripts",
      "jquery": "jquery-2.1.0.min",
      "jquery-ui": "jquery-ui-1.10.4.custom.min",
      "debounced-resize": "jquery.debouncedresize",
      "jcarousel": "jquery.jcarousel-core",
      "jcarousel-control": "jquery.jcarousel-control",
      "jcarousel-pagination": "jquery.jcarousel-pagination"
    },
    "shim": {
        "jcarousel": ["jquery"],
        "jquery-ui": ["jquery"],
        "debounced-resize": ["jquery"],
        "jcarousel-control": ["jquery", "jcarousel"],
        "jcarousel-pagination": ["jquery", "jcarousel"]
    }
});

// Load the main app module to start the app
requirejs(["scripts/main"]);