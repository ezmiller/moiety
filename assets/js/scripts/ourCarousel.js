define(["jquery", "jcarousel", "jcarousel-control"], function() {

	var init = function() {

		// initialize the projects carousel in the main-frame
		$('.jcarousel.projects').on('jcarousel:create jcarousel:reload', function() {
			// do some setup stuff...
		}).jcarousel({
			vertical: true
		});

		// initialize the individual project carousel in the main-frame
		$('.jcarousel.project').on('jcarousel:create jcarousel:reload', function() {
			var carousel = $(this);

			// set width of carousel by width of parent carousel, i.e. .jcarouse.projects
			carousel.css('width', $('.jcarousel.projects').css('width'));
			carousel.css('height', $('.jcarousel.projects').css('height'));

			// set item width equal to carousel width
			carousel.jcarousel('items').css('width', carousel.width());

			// vertically align the prev/next controls in the viewport
			carousel.find('a[class*="jcarousel-control-"]').vAlignInViewport();

		}).jcarousel();

	};

	// reveal module functions
	return {
		init: init
	};
})