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

	// Generate list of projects
    $files  = dir::inspect(c::get('root.content').'/01-projects');
    $projects = $files['children'];
    $projects = preg_filter(array('/\d+-([a-zA-Z|-]*)/'), array('$1'), $projects);

	// Generate list of existing categories
	$d = Spyc::YAMLLoad(c::get('root.content') . '/site.txt');
	$cats = array_key_exists('Categories', $d) ? explode(',', $d['Categories']) : array();
	$cats[] = 'all';
	$cats = preg_filter(array("/^\s/", "/['|\s]/"), array('', '-'),$cats);

	if ( $uri === '/sitemap' ) {
		$uri = $uri;
	}
	else if ( $uri === '/feed' ) {
		$uri = $uri;
	}
	else if ( str::contains($uri, 'category') && !str::contains($uri, '.')) {

		// Check to see if category is exists, otherwise cause error.
		$c = isset($path[1]) ? urldecode($path[1]) : 'all';
		if ( in_array($c, $cats) ) {
			$GLOBALS['category_name'] = ucwords(str_replace('-', ' ', $c));
		}
		else {
			$GLOBALS['category_name'] = '';
			go('/error');
		}

		// Check to see if project exists, otherwise cause error.
		$p = isset($path[2]) ? urldecode($path[2]) : null;
		if ( !is_null($p) && in_array($p, $projects) ) {;
			$GLOBALS['project_name'] = ucwords(str_replace('-', ' ', $p));
		} elseif ( !is_null($p) && !in_array($p, $projects) ) {
			$GLOBALS['project_name'] = '';
			go('/error');
		}

		$uri = '/category';

	}
	else {
		$GLOBALS['category_name'] = 'all';
		if ( !empty($path) ) {
			$GLOBALS['project_name'] = ucwords(str_replace('-', ' ',$path[0]));
			$uri = '/projects/'.$path[0];
		}
	}

?>