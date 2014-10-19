define(["jquery", 
		"scripts/helpers",
		"scripts/projects", 
		"scripts/page",
		"jquery-ui",
		"debounced-resize"], // see https://github.com/louisremi/jquery-smartresize, 
	    function($,helpers,projects,page,ourCarousel) {

	$(document).ready(function() {
		page.load();
		$('.gridnav').hide();
	});

	$(window).on('debouncedresize', function(e) {
		page.reload();
	});

});