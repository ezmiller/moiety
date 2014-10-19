
define(["jquery",
	    "scripts/helpers",
	    "scripts/projects",
	    "jcarousel",
	    "jcarousel-control",
	    "jcarousel-pagination"], function($,helpers,projects) {
     /**
     * Page view module
     * @module page
     */

    /** Contains informaiton about the page's state and configuration */
	var info = {
		title: siteTitle,
		loaded: false,
		mode: 'normal',
		viewport: {
			width: 0,
			height: 0,
			minWidth: 0,
			minHeight: 0
		},
		url: null,
		path: null,  // will ultimately hold window.location.pathname.split('/');
		thumbMenu: {
			thumbs: {
				width: 210,
				height: 133
			},
			gutter: 20,
			margin: {
				x: 0.075,
				y: 0.15
			},
			carousel: null
		}
	},

	/**
	 * Handles the loading of the page
	 * @function
	 */
	load = function() {

		$('.splash-text').animate({
			opacity: 1
		}, 400);

		this.setPageInfo();
		this.relocate( this.info.url );
		this.initThumbMenu();
		this.setupEvents();
		this.layout();

		$('.about, .main-frame, .main-nav, .gridnav').animate({
			opacity:1
		}, 400);

		if ( this.info.viewport.height <= this.info.viewport.minHeight) {
			$('.ctrl.up , .ctrl.down').css('background','none');
		}

		this.info.loaded = true;
	},

	/**
	 * Handles pages reload
	 * @function
	 */
	reload = function() {

		this.setPageInfo();
		this.clearThumbMenu();
		this.initThumbMenu();
		this.layout();
		if ( this.info.viewport.height <= this.info.viewport.minHeight) {
			$('.ctrl.up, .ctrl.down').css('background','none');
		} else {
			$('.ctrl.up, .ctrl.down').css('background','');
		}

	},

	/**
	 * Relocates the page view to a new project based on a url
	 * @function
	 *
	 * @param {string} contains a url
	 */
	relocate = function(url) {
		var pageTitle,
			html,
			path = url.replace(/^http:\/\/[^/]*/,'').split('/');

		// Calls the funciton that actually handles the request and shifts the page view to the right project
		this.handleRequest( path );

		// Change the URL in the address bar and manage history
		html = document.getElementsByClassName('main-frame')[0].innerHTML
		pageTitle = document.title;
		this.pushToHistory( url, pageTitle, html);
	},

	/**
	 * Takes in a path asks and displays the right project
	 *
	 * Determines from the path whether the request is for showing all projects,
	 * a specific category of projects, a specific project within a cateogry,
	 * or a specific project within all projects. It then initializes the project
	 * module in the right mode, and asks the project module to return the correct
	 * project for display.
	 * @function
	 *
	 * @param {array} containing the elements of a path
	 */
	handleRequest = function(path) {

		if ( path[1] == '' ) {  // showing all projects
			this.populateMainFrame( projects.init('category', 'all'), 'relocate' );
		}
		else if ( path[1] == 'category' ) {
			this.info.mode = 'category';
			if ( 3 in path ) {
				this.populateMainFrame( projects.init('single-in-category', {'category': path[2], 'project': path[3]}), 'relocate');
			} else {
				this.populateMainFrame( projects.init('category', path[2]), 'relocate');
			}
		}
		else {
			var success = projects.init( 'single', path[1] );
			if ( success !== null ) {
				document.title = this.info.title+' - '+success.center.projectName;
				this.populateMainFrame( success, 'relocate' );
			} else {
				console.error("Failed to get projects with slug: "+path[1]);
			}
		}

	},

	/**
	 * Sets up the info variable with various information about the page
	 * @function
	 */
	setPageInfo = function() {

		this.info.viewport.width = $(window).width();
		this.info.viewport.height = $(window).height();
		this.info.viewport.minHeight = 500;
		this.info.viewport.minWidth = 500;
		this.info.url = window.location.href;
		this.info.path = window.location.pathname.split('/');  // return array of path elements
		this.info.thumbMenu.carousel = $('.jcarousel.thumbs');

	},

	/**
	 * Handles the layout of the page
	 * @function
	 */
	layout = function() {
		var page = this;

		$('.main').css('height', this.info.viewport.height);
		$('.main-frame').vAlignInViewport();
		$('.option.center').find('img').load(function() {
			$('.main-nav .left, .main-nav .right').css('width', (page.info.viewport.width - $(this).width()) /2);
			$('.main-nav .up, .main-nav .down').css('height', (page.info.viewport.height - $(this).height()) /2);
		});
		$('.main-nav .left, .main-nav .right').css('width', (page.info.viewport.width - $('.option.center img, .option.center iframe').width()) /2);
		$('.main-nav .up, .main-nav .down').css('height', (page.info.viewport.height - $('.option.center img, .option.center iframe').height()) /2);
		$('.main-nav .left img, .main-nav .right img').vAlignInViewport();

		// place the caption near the image
		$('.option.center img, .option.center iframe').each(function() {
			var caption = $(this).parent().find('.caption'),
				h = $(this).outerHeight(true),
				bM = parseInt($(this).css('margin-bottom')),
				pos = (h-bM);
			caption.css('top', pos+'px');
			caption.hAlign();
		});

		// disable right/left nav when only one image
		if ( projects.getProjectMediaCount() <= 1 ) {
			$('.main-nav .left img, .main-nav .right img').hide();
		} else {
			$('.main-nav .left img, .main-nav .right img').show();
		}


	},

	/**
	 * Handles the animation/movement on the page from one project to another
	 * and from one image within a project to another.
	 * @function
	 *
	 * @param {string} indicating the direction of the animation/movement
	 * @param {Function} callback containing a function to be called when the animation ends
	 */
	animate = function(dir, callback) {

		switch(dir){
			case "left":
				$('.option.center').animate({left:'3000px'},500);
				$('.option.left').animate({left:0},500,'swing',callback);
				break;
			case 'right':
				$('.option.center').animate({left:'-3000px'},500);
				$('.option.right').animate({left:0},500,'swing',callback);
				break;
			case "up":
				$('.option.center').animate({top:'3000px'},500);
				$('.option.up').animate({top:0},500,'swing',callback);
				break;
			case "down":
				$('.option.center').animate({top:'-3000px'},500);
				$('.option.down').animate({top:0},500,'swing',callback);
		}

	},

	/**
	 * Handles the management of the history when moving to a new url
	 * @function
	 *
	 * @param {string} url Contains the new url
	 * @param {string} pageTitle Contains the title of the project at the new url
	 * @param {Object} hmtl Contains the content of the new page
	 */
	pushToHistory = function(url, pageTitle, html) {
		history.pushState({'html':html, 'pageTitle':pageTitle}, pageTitle, url);
 		this.setPageInfo();
	},

	/**
	 * Determines the direction that the user want to move based on
	 * relationship to a central point. Note: This function is used
	 * in conjuction with an event setup in the setupEvents method.
	 * @function
	 *
	 * @param {int} localX The x location of the user's click
	 * @param {int} localY They y location of the user's click.
	 * @param {int} centerX The x location of the specified central point
	 * @param {int} centerY The y location of the specified central point
	 */
	getDirectionFromCoordinates = function (localX, localY, centerX, centerY){
		var dir;

		if(localX>centerX)
			dir ='right';
		else
			dir ='left';

		return dir;
	},

	/**
	 * Sets up the events for the page
	 * @function
	 */
	setupEvents = function() {

		var page = this;  // makes it possible to refer to page module's function inside jQuery event functions

		$('#logo').on('click', function(e) {
			e.preventDefault();
			page.toggleAbout();
		});

		$('.splash').on('click', function(e) {
			e.preventDefault();
			page.removeSplash();
		});

		$(document).on('click', '#foffabout', function() {
			page.toggleAbout();
		});

		$('.shutter').on('click', function(e) {
			e.preventDefault;
			page.toggleThumbMenu();
		});

		$(document).on('click', '.category-filter', function(e) {
			e.preventDefault();
			$(this).parent().find('.active').removeClass('active');
			$(this).addClass('active');
			page.clearThumbMenu();
			page.relocate( e.target.href );
			page.initThumbMenu();
			page.layout();
		});

		$(document).on('click', '.option.center img',
			function(e) {
				var centerX = e.target.offsetWidth/2,
					centerY = e.target.offsetHeight/2,
					globalX = $(this).offset().left,
       	    		globalY = $(this).offset().top,
       	    		clickX = e.pageX-globalX,
           			clickY = e.pageY-globalY;

           		dir = page.getDirectionFromCoordinates(clickX, clickY, centerX, centerY);

				var options = projects.move( dir );
				if(options == null) return;

				page.animate(dir , function() {
					page.populateMainFrame(options, dir);
					page.layout();
					if ( dir == 'up' || 'down' ) {
						var url = options.center.url,
							pageTitle = document.title,
							html = document.getElementsByClassName('main-frame')[0].innerHTML;
						page.pushToHistory(url, pageTitle, html)
					}
					$('.option.center img, .option.center iframe').trigger('mouseover');
				});
			}
		);

		$('.left, .right, .up, .down').on('click', function(e) {
			e.preventDefault();
			var dir = $(this).attr('class').slice(5);

			if ( $(this).parent().attr('class') == 'main-nav' ) {

				var options = projects.move( dir );

				if(options == null) return;

				page.animate(dir, function() {

					// set document title
					if ( page.info.mode === 'category' ) {
						document.title = page.info.title+' - Category - '+options.center.projectName;
					} else {
						document.title = page.info.title+' - '+options.center.projectName;
					}

					// repopulate the main frame
					page.populateMainFrame(options, dir);
					page.layout();

					// if going between projects update the url with new project and save history
					if ( dir == 'up' || 'down' ) {
						var url = options.center.url,
						    pageTitle = document.title,
						    html = document.getElementsByClassName('main-frame')[0].innerHTML;
						page.pushToHistory(url, pageTitle, html);
					}
				});

			} else if ( $(this).parent().attr('class') == 'thumbmenu-nav' ) {
				$(this).jcarouselControl({
					target: ( dir == 'right' ) ? '+=1' : '-=1'
				});
			}
		});

		$(document).on('click', '.grid-item a', function(e) {
			e.preventDefault();
			page.relocate( $(this).attr('href').replace('/projects','') );  // strip /projects if there, might not have been removed earlier
     		page.toggleThumbMenu();
		});

		window.onpopstate = function(e){
		    if(e.state){
		        document.getElementsByClassName('main-frame')[0].innerHTML = e.state.html;
		        document.title = e.state.pageTitle;
		    }
		};

		var timer;

		$(document).on('mouseover', '.option.center img, .option.center iframe',
			function (e){
				timer=setTimeout(
					function(){
						$('.option.center .caption').css('z-index',5555).css('opacity', 1);
					},
					500
				)
			}
		);
		$(document).on('mouseout', '.option.center img, .option.center iframe',
			function (e){
				clearTimeout(timer);
				$('.option.center .caption').css('opacity', 0).css('z-index','');
			}
		);
	},

	/**
	 * Replaces the content in the main frame wiht the content at the
	 * current position in the project matrix.
	 * @function
	 *
	 * @param {Object} options Contains the set of project items to be displayed
	 * @param {string} dir Contains the direction to move, or 'relocate' if the
	 *     view is jumping to a new non-adjacent location.
	 */
	populateMainFrame = function (options, dir) {

		if ( options == null )
			return;

		if ( dir == 'relocate' ) {

			var l = options.left != null ? this.createOptionContent(options.left, 'left') : null,
			r = options.right != null ? this.createOptionContent(options.right, 'right'): null,
			u = options.up != null ? this.createOptionContent(options.up, 'up') : null,
			d = options.down != null ? this.createOptionContent(options.down, 'down') : null,
			c = options.center != null ? this.createOptionContent(options.center, 'center') : null;

			$('.option').remove();
			$('.main-frame').append(c).append(l).append(r).append(u).append(d);

		}
		else {

			var l = options.left != null ? this.createOptionContent(options.left, 'left') : null,
				r = options.right != null ? this.createOptionContent(options.right, 'right'): null,
				u = options.up != null ? this.createOptionContent(options.up, 'up') : null,
				d = options.down != null ? this.createOptionContent(options.down, 'down') : null;

			$('.option:not(.'+dir+')').remove();
			var newCenter = $('.option.'+dir).removeClass(dir).addClass('center');
			$('.main-frame').append(l).append(r).append(u).append(d);

		}
	},

	/**
	 * Creates the html necessary to display a given project item and packages
	 * it into a javascript Object.
	 * @function
	 *
	 * @param {Object} o Contains the raw data for the displayed project item
	 * @param {string} dir Specifies the positioning of the element in the
	 *     current set of items, i.e. is this project item displayed at left,
	 *     right, up, down, or center.
	 * @return {HTMLElement} elem Containing the html for the project item
	 */
	createOptionContent = function(o, dir){

		var url = o.url,
			media = o.media,
			caption = o.caption,
			pName = o.projectName;

		var elem = $('<article class="option '+dir+'" data-url="'+url+'"></article>');
		if ( typeof media !== 'undefined' ) {
			if ( media.type === 'image' )
				elem.append('<img src="'+media.url+'" alt="'+caption+'"/>');
			if ( media.type === 'video' )
				elem.append(media.embed);
			if ( media.type === 'audio' )
				elem.append(media.embed);
			elem.append('<div class="caption"><h1 class="media-title">'+media.caption_title+'<br></span><h2 class="description">'+media.description+'</span></div>');
		}

		if ( dir === 'center' ) {
			elem.find('img, iframe').load(function() {
				var caption = $(this).parent().find('.caption'),
					h = $(this).outerHeight(true),
					bM = parseInt($(this).css('margin-bottom')),
					pos = (h-bM);
				caption.css('top', pos+'px');
				caption.hAlign();
			});
		}

		return elem;
	},

	/**
	 * Initializes the thumbmenu
	 * @function
	 */
	initThumbMenu = function() {

		// Set up the thumbmenu on the page
		this.setupThumbMenu();

		// Load the carousel code to handle animation etc
		$('.jcarousel.thumbs').on('jcarousel:create jcarousel:reload', function() {
			// could do some setup stuff...
		}).jcarousel({
			// could so some config here
		});

		$('.jcarousel-pagination')
			.on('jcarouselpagination:active', 'a', function() {
				$(this).addClass('active');
			})
			.on('jcarouselpagination:inactive', 'a', function() {
				$(this).removeClass('active');
			})
			.on('click', function(e) {
				e.preventDefault();
			})
			.on('jcarouselpagination:createend', function(e) {
				if ( $(this).find('a').length == 1 ) {
					$(this).jcarouselPagination('destroy');
				}
			})
			.on('jcarouselpagination:reloadend', function(e) {
				if ( $(this).find('a').length == 1 ) {
					$(this).jcarouselPagination('destroy');
				}
			})
			.jcarouselPagination({
				item: function(page) {
		    		return '<a href="#' + page + '">' + page + '</a>';
				}
			});

	},

	/**
	 * Sets up the thumbmenu on the page
	 * @function
	 */
	setupThumbMenu = function() {

		// short variable for config object
		var c = this.info.thumbMenu;

		// check to see if carousel object is set
		if ( c.carousel.length == 0 ) {
			console.error("The thumb menu's carousel object is not set.", c.carousel);
		}

		var grid = this.calculateThumbGrid();

		// add pages of thumbs
		$.each(projects.get(), function() {

			// add new carousel <li> where necessary
			var e;
			if ( this.i % grid.itemsPerPage == 0 ) {
				c.carousel.find('ul').append('<li class="grid-page"><div></div></li>');
			}

			// add project thumb
			var classes = ( (this.i+1) % grid.cols  == 0 ) ? 'grid-item rightmost' : 'grid-item';
			var elem = $('<div class="'+classes+'"></div>');
			elem.append('<a href="'+this.url+'">'+this.thumb+'<div class="overlay"><div><h1 class="project-title">'+this.title+'</h1><h2 class="project-description">'+this.description+'</h2></div></div></a>');
			$('.grid-page > div').last().append(elem);

		});

		// layouts thumb grid and pages
		$('.grid-item').css({'width':c.thumbs.width+'px', 'height':c.thumbs.height+'px','margin-right': c.gutter+'px','margin-bottom': c.gutter+'px' });
		$('.grid-item.rightmost').css('margin-right','');
		$('.gridframe, .grid-page').css({
			'width': ( (grid.cols*c.thumbs.width) + ((grid.cols-1)*c.gutter) )+'px',
			'height': ( (grid.rows*c.thumbs.height) + ((grid.rows-1)*c.gutter) )+'px'
		});
		$('.gridframe').vAlignInViewport();
		$('.grid-item .project-title').vAlign();
	},

	/**
	 * Calculates the number pages and number of thumbs per page
	 * @function
	 */
	calculateThumbGrid = function() {

		c = this.info.thumbMenu;

		// first attempt to calculate cols and rows
		var cols = Math.floor( ( this.width() - 2*c.margin.x*this.width() )  / c.thumbs.width );
		var rows = Math.floor( ( this.height() - 2*c.margin.y*this.width() ) / c.thumbs.height );

		// now account for gutter space and if necessary remove one column or row
		cols = ( cols*c.thumbs.width + (cols-1)*c.gutter <= this.width() - 2*c.margin.x ) ?
		       cols : (cols) ? cols-1 : 0;
		rows = ( rows*c.thumbs.hight + (rows-1)*c.gutter <= this.height() - 2*c.margin.y ) ?
		       rows : (rows) ? rows : 0;

		// reduce num of rows if too few projects to fill
		while ( projects.count() <= cols*(rows-1) ) {
			rows--;
		}

		// there should always at least be 1
		cols = ( cols ) ? cols : 1;
		rows = ( rows ) ? rows : 1;
		itemsPerPage = ( itemsPerPage ) ? itemsPerPage : 1;

		var itemsPerPage = cols * rows;

		return { rows: rows, cols: cols, itemsPerPage: itemsPerPage };

	},

	/**
	 * Triggers the opening of the about section of the page
	 * @function
	 */
	aboutOpen = function (){
		if($('.about').data('open') == "true")
			return true;
		return false;
	},

	/**
	 * Toggles the open/close of about section
	 * @function
	 */
	toggleAbout = function(){
		if($('.about').data('open') == "true") {
			$('.about').data('open', "false");
			$('#foffabout').remove();
		}
		else {
			$('.about').data('open', "true");
			$('.container').append('<div id="foffabout" style="position:fixed;top:0;right:0;width:58%;height:100%;float:right;z-index:10000"></div>');
		}

		$('.about').toggle('slide');
	},

	/**
	 * Toggles the thumb menu
	 * @function
	 */
	toggleThumbMenu = function() {
		if ( $('.main-nav').css('visibility') == 'hidden' ) {
			$('.main-nav').css('visibility', 'visible');
			$('.thumbmenu-nav').css('visibility','hidden');
		} else {
			$('.main-nav').css('visibility', 'hidden');
			$('.thumbmenu-nav').css('visibility','visible');
		}
		$('.gridnav').toggle('slide', { direction: 'up'} );
	},

	/**
	 * Removes the splash screen
	 * @function
	 */
	removeSplash = function() {
		$('.splash').toggle('slide', {easing: 'linear', duration: 400, direction: 'up'} );
	},

	/**
	 * Clears the thumb menu
	 * @function
	 */
	clearThumbMenu = function() {
		this.info.thumbMenu.carousel.find('ul').empty();
	},

	/**
	 * Returns the height of the viewport
	 * @function
	 * @return {int} The height of page viewport
	 */
	height = function() {
		return this.info.viewport.height;
	},

	/**
	 * Returns the width of the viewport
	 * @function
	 * @return {int} The width of page viewport
	 */
	width = function() {
		return this.info.viewport.width;
	},

	/**
	 * Returns true/false if the page is loaded.
	 * @function
	 * @return {Boolean} True/false if the page is loaded or not.
	 */
	loaded = function() {
		return this.info.loaded;
	};

	//reveal module functions
	return {
		info: info,
		load: load,
		reload: reload,
		handleRequest: handleRequest,
		setPageInfo: setPageInfo,
		layout: layout,
		populateMainFrame: populateMainFrame,
		createOptionContent: createOptionContent,
		getDirectionFromCoordinates: getDirectionFromCoordinates,
		setupEvents: setupEvents,
		animate: animate,
		relocate: relocate,
		pushToHistory: pushToHistory,
		initThumbMenu: initThumbMenu,
		setupThumbMenu: setupThumbMenu,
		calculateThumbGrid: calculateThumbGrid,
		aboutOpen: aboutOpen,
		toggleAbout: toggleAbout,
		toggleThumbMenu: toggleThumbMenu,
		removeSplash: removeSplash,
		clearThumbMenu: clearThumbMenu,
		loaded: loaded,
		height: height,
		width: width
	};

});
