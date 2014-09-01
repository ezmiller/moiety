{
	"appDir": "./assets",
	"baseUrl": "./js/vendor",
	"dir": "built",
	"optimizeCss": "standard",
	"removeCombined": true,
	"modules": [
		{
			"name": "app"
		}
	],
	"paths": {
		"app": "../app",
		"scripts": "../scripts",
		"jquery": "jquery-2.1.0.min",
		"jquery-ui": "jquery-ui-1.10.4.custom.min",
		"debounced-resize": "jquery.debouncedresize",
		"jcarousel": "jquery.jcarousel-core",
		"jcarousel-control": "jquery.jcarousel-control",
		"jcarousel-pagination": "jquery.jcarousel-pagination"
	},
	"shim": {
        "jcarousel": {
        	"deps": ["jquery"]
        },
        "jquery-ui": {
        	"deps": ["jquery"]
        },
        "debounced-resize": {
        	"deps": ["jquery"]
        },
        "jcarousel-control": {
        	"deps": ["jquery", "jcarousel"]
        },
        "jcarousel-pagination": {
        	"deps": ["jquery", "jcarousel"]
        }
    }
}