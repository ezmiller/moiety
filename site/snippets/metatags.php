<?php
global $category_name;
global $project_name;
?>
<?php if ($type === 'facebook') : ?>
	<meta property="og:type"            content="website" />
	<meta property="og:site_name"       content="<?php echo $site->title() ?>"/> 
	<meta property="og:url"             content="<?php echo $site->url().'/'.$site->uri()->path(2); ?>" /> 
	<?php if ( $page->isHomePage() ) : ?>
	    <meta property="og:title" content="<?php echo $site->title() ?> - <?php echo $page->title()?>" />
	    <meta property="og:description" content="<?php echo $site->description()?>" />
	    <?php if ( $pages->find('/splash')->hasImages() ) : ?>
	    <meta property="og:image" content="<?php echo $pages->find("/splash")->images()->first()->url() ?>" />
	    <meta property="og:image:url" content="<?php echo $pages->find("/splash")->images()->first()->url() ?>" />
	    <?php else : ?>
	    <meta property="og:image" content="<?php echo $pages->find("/home")->images()->first()->url() ?>" />
	    <meta property="og:image:url" content="<?php echo $pages->find("/home")->images()->first()->url() ?>" /> 
		<?php endif; ?>
	<?php elseif ( $project_name !== null ) : ?>
		<?php if ( $category_name !== null ) : ?>
			<meta property="og:title" content="<?php echo $site->title.' - '.ucwords($project_name) ?>" />
		    <meta property="og:description" content="<?php echo html($pages->find('/projects/'.strtolower($project_name))->text()) ?>" />
	        <?php if ( $pages->find('/projects/'.strtolower($project_name))->children()->first()->template() === 'image' ) : ?>
	        <meta property="og:image" content="<?php echo $pages->find('/projects/'.strtolower($project_name))->children()->first()->images()->first()->url(); ?>" />
	        <meta property="og:image:url" content="<?php echo $pages->find('/projects/'.strtolower($project_name))->children()->first()->images()->first()->url(); ?>" />
	        <?php elseif ( $pages->find('/projects/'.strtolower($project_name))->children()->first()->template() === 'video' ) : ?>
	        <meta property="og:image" content="<?php echo videos::thumb($pages->find('/projects/'.strtolower($project_name))->children()->first()->video_url()); ?>" />
	        <meta property="og:image:url" content="<?php echo videos::thumb($pages->find('/projects/'.strtolower($project_name))->children()->first()->video_url()); ?>" />
	        <?php endif; ?>
		<?php else : ?>
		    <meta property="og:title" content="<?php echo $site->title.' - '.$page->title()?>" />
		    <meta property="og:description" content="<?php echo html($page->text()) ?>" />
	        <?php if ( $pages->active()->children()->first()->template() === 'image' ) : ?>
	        <meta property="og:image" content="<?php echo $pages->active()->children()->first()->images()->first()->url(); ?>" />
	        <meta property="og:image:url" content="<?php echo $pages->active()->children()->first()->images()->first()->url(); ?>" />
	        <?php elseif ( $pages->active()->children()->first()->template() === 'video' ) : ?>
	        <meta property="og:image" content="<?php echo videos::thumb($pages->active()->children()->first()->video_url()); ?>" />
	        <meta property="og:image:url" content="<?php echo videos::thumb($pages->active()->children()->first()->video_url()); ?>" />
	        <?php endif; ?>
	 	<?php endif; ?>
    <?php elseif ( $category_name !== null ) : ?>
	    <meta property="og:title" content="<?php echo $site->title.' - Category Archive - '.$category_name ?>" />
	    <meta property="og:description" content="An archive of projects in the category: <?php echo $category_name ?>" />
	    <meta property="og:image" content="" />
	    <meta property="og:image:url" content="" />
	    <?php if ( $pages->find('/splash')->hasImages() ) : ?>
	    <meta property="og:image" content="<?php echo $pages->find("/splash")->images()->first()->url() ?>" />
	    <meta property="og:image:url" content="<?php echo $pages->find("/splash")->images()->first()->url() ?>" />
	    <?php else : ?>
	    <meta property="og:image" content="<?php echo $pages->find("/home")->images()->first()->url() ?>" />
	    <meta property="og:image:url" content="<?php echo $pages->find("/home")->images()->first()->url() ?>" /> 
		<?php endif; ?>
	<?php endif; ?>	
<?php endif; ?>

<?php if ($type === 'twitter') : ?>
<?php endif; ?>	