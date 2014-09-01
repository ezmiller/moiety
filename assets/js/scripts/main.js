define(["jquery", 
		"scripts/helpers",
		"scripts/projects", 
		"scripts/page",
		"scripts/ourCarousel",
		"jquery-ui",
		"debounced-resize"], // see https://github.com/louisremi/jquery-smartresize, 
	    function($,helpers,projects,page,ourCarousel) {

	$(document).ready(function() {
		page.load();
		$('.gridnav').hide();
//		ourCarousel.init();
	});

	$(window).on('debouncedresize', function(e) {
		console.log('resize event');
		page.reload();
	});

});