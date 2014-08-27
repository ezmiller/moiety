<?php

	/**
	*	Intercepts the $_SERVER object containing the HTTP request information 
	*   in order to change it before Kirby loads the site
	* 
	*   Currently it does the following:
	*      1. Check to see if the REQUEST_URI contains the slug 'category'
	*      2. If it does not, then it preprends /projects/ to the path.
	*/
	$uri = &$_SERVER['REQUEST_URI'];  // passing as reference
	$base = 'http://'.$_SERVER['HTTP_HOST'];
	$path = str::split($uri, '/');

//	echo 'uri:';
//	dump($uri);
//	echo 'path:';
//	dump($path);

	if ( $uri === '/sitemap' ) {
		$uri = $uri;
	}
	else if ( $uri === '/feed' ) {
		$uri = $uri;
	}
	else if ( str::contains($uri, 'category') && !str::contains($uri, '.')) {
		$GLOBALS['category_name'] = ucwords($path[1]);
		if ( isset($path[1]) ) {
			$GLOBALS['category_name'] = $path[1];
		} else {
			$GLOBALS['category_name'] = 'all';
		}
		if ( isset($path[2]) ) $GLOBALS['project_name'] = $path[2];
		$uri = '/category';
	}
	else {
		$GLOBALS['category_name'] = 'all';
		if ( empty($path) ) {
			//$uri = '/';
		} else {
			$GLOBALS['project_name'] = ucwords($path[0]);
			$uri = '/projects/'.$path[0];
		}
	}
	 
?>