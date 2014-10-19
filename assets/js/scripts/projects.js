define(["jquery", "scripts/helpers"], function($,helpers) {
     /**
     * Projects Model module
     * @module projects
     */

	/** capture the projects data from the global level */
	if ( typeof projects === 'undefined' ) {
		console.error("The projects JSON object is missing.");
	} else {
		var _projects = projects;
	}

	var category = "all";
	var activeProjects = new Array();
	var indexX;
	var indexY; // Y is projects, X is media for the current project
	var loop = imagesInLoop;

	/**
	 * Sets the projects to display a category and returns a project set.
	 * @function
	 *
	 * @param {string} mode The mode that the projects module is being initalized in,
	 *    i.e. 'category', 'single', or 'single-in-category'.
	 * @param {string|Object} target Contains the name of a category or an Object
	 *    containing the name of a cateogry and the specific project to return.
	 * @return {null|Object} Returns a project set (i.e. a center object and the items
	 *    that should appear above, below, and to the right and the left), or null if
	 *    nothing to return.
	 */
	var init = function (mode,target){
		this.resetToXY(0,0);
		if ( mode === 'category' ){
			this.setCategory( target );
			return this.relocateToY(0);
		}
		else if ( mode === 'single' ){
			this.setCategory( 'all' );
			return this.relocate( target );
		}
		else if ( mode === 'single-in-category' ) {
			this.setCategory( target.category );
			return this.relocate( target.project );
		}
		else {
			return null;
		}
	};

	/**
	 * Returns the number of active projects, i.e. either
	 * all the projects or the number of projects in the
	 * current category.
	 * @function
	 *
	 * @return {int} The number of active projects.
	 */
	var count = function() {
		return activeProjects.length;
	};

	/**
	 * Returns the active projects.
	 * @function
	 *
	 * @return {Array} Containing all the active projects.
	 */
	var get = function() {
		return activeProjects;
	};

	/**
	 * Returns all the projects and not just the active projects.
	 * @function
	 *
	 * @return {Object} Containing all the projects.
	 */
	var getAll = function() {
		return _projects;
	}

	/**
	 * Returns the number of media items for the project that is currently
	 * at the center of the project matrix.
	 * @function
	 *
	 * @return {int} Number of media items in the current project.
	 */
	var getProjectMediaCount = function() {
		var project = activeProjects[indexY];
		return project.media.length;
	}

	/**
	 * Sets the active category and causes the project module
	 * to set its currently active projects.
	 * @function
	 */
	var setCategory = function (categoryName){	// sets a new categpry and recomputes the subset of projects
		category = categoryName;
		this.reactivateProjects();
	};

	/**
	 * Sets the contents of the currently active projects based on
	 * the current category.
	 * @function
	 */
	var	reactivateProjects = function(){		// recomputes subset of projects based on current category

		activeProjects = new Array();

		if(category == "all"){
			activeProjects = this.getAll();
			return;
		}

		// if specific category has been selected, set activeProjects to subset and update the urls
		var newI=0, allProjects = this.getAll();
		for(var i=0;i<allProjects.length;i++){
			var categories = allProjects[i].categories.split(', ');
			var p, a, u;
			if(categories.indexOf(category)>-1) {
				p = $.extend(true, {},allProjects[i]);
				a = document.createElement('a');
				a.href = p.url;
				u = siteURL+'/category/'+category+a.pathname;
				p.url = u;
				p.i = newI++;
				activeProjects.push(p);
			}
		}
	};

	/**
	 * Changes the currently active project by 'moving' in some direction.
	 * @function
	 *
	 * @param {string} Indicates the direction to move in: 'left', 'right',
	 *    'up', 'down'.
	 * @return {Object} Project set for the new location
	 */
	var move = function(dir){					// switches into appropiate method calls

		switch(dir){
			case "left":
				if(!imagesInLoop){
					if(indexX == 0)
						return null;
				}
				else{
					if(activeProjects[indexY].media.length == 1)
						return null;
					if(indexX == 0){
						indexX = activeProjects[indexY].media.length-1;
						break;
					}
				}
				indexX--;
				break;
			case 'right':
				if(!imagesInLoop){
					if(activeProjects[indexY].media.length<=indexX+1)
						return null;
				}
				else{
					if(activeProjects[indexY].media.length == 1)
						return null;
					if(indexX==activeProjects[indexY].media.length-1){
						indexX=0;
						break;
					}
				}
				indexX++;
				break;
			case "up":
				if(!imagesInLoop){
					if(indexY == 0)
						return null;
				}
				else{
					if(indexY == 0){
						indexY = this.count()-1;
						indexX=0;
						break;
					}
				}
				indexY--;
				indexX=0;
				break;
			case "down":
				if(!imagesInLoop){
					if(indexY >= this.count()-1)
						return null;
				}
				else{
					if(indexY >= this.count()-1){
						indexY = 0;
						indexX = 0;
						break;
					}
				}
				indexY++;
				indexX=0;
		}
		return this.getOptionsForCurrentPosition();
	};

	/**
	 * Returns an object containing project item information.
	 * @function
	 *
	 * @param {string} u The url of the item
	 * @param {string} n The name of the project the item is associated with
	 * @param {string} c The item caption
	 * @param {Object} m Contains information for the media item associated
	 *   with the project item.
	 * @return {Object} The project item object
	 */
	var createStep = function (u, n, c, m){
		var step = {
			url: u,
			projectName: n,
			caption: c,
			media: m
		};
		return step;
	};

	/**
	 * Extracts a slug from a url
	 * @function
	 *
	 * @return {string} The slug
	 */
	var slug = function (url){
		var a = url.split('/');
		return a[a.length-1];
	};

	/**
	 * Returns project set after relocating to project specified by name (slug)
	 * @function
	 *
	 * @parm {string} name The name (slug) of the project to which to relocate.
	 * @return {Object} Project set for new project location
	 */
	var relocate = function (name){
		for(var i=0;i<activeProjects.length;i++){
			if(name == this.slug(activeProjects[i].url))
				return this.relocateToY(i);
		}
		return null; // only if we didn't find that project
	};

	/**
	 * Resets internal indexes that track location in project matrix
	 * @function
	 *
	 * @param {int} x New Y location for project matrix X index
	 * @param {int} y New Y location for project matrix Y index
	 */
	var resetToXY = function(x,y){
		indexX = x;
		indexY = y;
	};

	/**
	 * Returns new project set after relocating to a new Y (project) location
	 * @function
	 *
	 * @param {int} y The new Y (project) location
	 * @return {Object} Project set for the new project location
	 */
	var relocateToY = function (y){
		this.resetToXY(0,y);

		if ( this.count() === 0 )
			return null;

		return this.getOptionsForCurrentPosition();
	};

	/**
	 * Returns the project set for the current location
	 * @function
	 *
	 * @return {Object} Project set for the current location
	 */
	var getOptionsForCurrentPosition = function(){
		return this.getOptionsForXY(indexX, indexY);
	};

	/**
	 * Returns the project location for a specific coordinate location.
	 * @function
	 *
	 * @param {int} x The X coordinate of specified location
	 * @param {int} y The Y coordinate of specified location
	 * @ @return {Object} The project set for the specified location
	 */
	var getOptionsForXY = function(x,y){

		var options = {
			center: this.getStepForXY(x, y),
			left: this.getStepForXY(x-1, y),
			right: this.getStepForXY(x+1, y),
			up: this.getStepForXY(0, y-1),
			down: this.getStepForXY(0, y+1)
		};
		return options;
	};

	/**
	 * Returns a project information object for a specific coordinate location.
	 * @function
	 *
	 * @param {int} x The X coordinate of specified location
	 * @param {int} y The Y coordinate of specified location
	 * @return {Object} Project information object for the specified location.
	 */
	var getStepForXY = function(x, y){

		if(imagesInLoop){
			/*if(projects[y].media.length == 1 && x!=0)
				return null;*/
			if(y>=activeProjects.length)
				y = 0;
			if(y == -1)
				y = activeProjects.length-1;
			if(x == activeProjects[y].media.length)
				x = 0;
			if(x == -1)
				x = activeProjects[y].media.length-1

		}
		else{
			if(x<0 || y>=activeProjects.length || y<0 || x>=activeProjects[y].media.length )
				return null;
		}

		project = activeProjects[y];
		return this.createStep(project.url, project.title, project.description, project.media[x]);
	};

	////////////////////////////////////////////////////////////////////////////////////////////////

	return {
		get: get,
		getAll: getAll,
		getProjectMediaCount: getProjectMediaCount,
		count: count,
		move: move,
		relocate: relocate,
		createStep: createStep,
		reactivateProjects: reactivateProjects,
		setCategory: setCategory,
		slug: slug,
		getOptionsForXY: getOptionsForXY,
		getStepForXY: getStepForXY,
		relocateToY: relocateToY,
		getOptionsForCurrentPosition: getOptionsForCurrentPosition,
		resetToXY: resetToXY,
		init: init
	};
});