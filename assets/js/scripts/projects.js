define(["jquery", "scripts/helpers"], function($,helpers) {

	// capture the projects data from the global level
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

	var count = function() {
		return activeProjects.length;
	};

	var get = function() {
		return activeProjects;
	};

	var getAll = function() {
		return _projects;
	}

	var getProjectMediaCount = function() {
		var project = activeProjects[indexY];
		return project.media.length;
	}

	var setCategory = function (categoryName){	// sets a new categpry and recomputes the subset of projects
		category = categoryName;
		this.reactivateProjects();
	};
	
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
	
	var createStep = function (u, n, c, m){
		var step = {
			url: u,
			projectName: n,
			caption: c,
			media: m
		};
		return step;
	};
	
	var slug = function (url){						// returns last Path Component
		var a = url.split('/');
		return a[a.length-1];
	};
	
	var relocate = function (name){					// returns options after relocating to project specified by name (slug)	
		for(var i=0;i<activeProjects.length;i++){
			if(name == this.slug(activeProjects[i].url))
				return this.relocateToY(i);
		}
		return null; // only if we didn't find that project
	};
	
	var resetToXY = function(x,y){					// resets internal indexes
		indexX = x;
		indexY = y;
	};
	
	var relocateToY = function (y){	
		this.resetToXY(0,y);

		if ( this.count() === 0 )
			return null;
		
		return this.getOptionsForCurrentPosition();
	};
	
	var getOptionsForCurrentPosition = function(){
		return this.getOptionsForXY(indexX, indexY);
	};
	
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



/*	


var possibleSteps = {
	//each one contains a "step"
	left ={},
	right = {},
	center ={},
	top ={},
	bottom = {}
}

	

var step = {
	
	projectName ="",
	caption="",
	url =""
}

move('direction');
relocate('name')

*/