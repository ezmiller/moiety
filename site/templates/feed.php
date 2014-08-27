<?php 

$projects = $pages->find('projects')->children()->visible()->flip()->limit(10);

snippet('feed', array(
  'link'  => url('blog'),
  'items' => $projects,
  'descriptionField'  => 'text', 
  'descriptionLength' => 300
));

?>
