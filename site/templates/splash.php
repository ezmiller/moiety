<?php snippet('header') ?>
<?php //snippet('menu') ?>
<?php //snippet('submenu') ?>

<?php
	/*$category = $site->uri()->path()->last();
	if($category == 'projects'){
		$category = '';
	}
	$projects = $pages->find('projects')->children();
	$found = $projects->filterBy('categories', $category);*/

?>

<?php snippet('body') ?>

<?php snippet('footer') ?>
