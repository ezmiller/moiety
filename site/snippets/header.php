<!DOCTYPE html>
<html lang="en">
<head>
    <?php 
    global $project_name; 
    global $category_name;
    ?>   
    <?php if ( isset($category_name) && !$page->isHomePage() ) : ?>
        <title><?php echo html($site->title()) ?> - Category Archive - <?php echo html(strtoupper($category_name)) ?></title>
    <?php elseif ( isset($project_name) ) : ?>
        <title><?php echo html($site->title()) ?> - <?php echo html($page->title()) ?></title>
    <?php else : ?>
         <title><?php echo html($site->title()) ?> - <?php echo html($page->title()) ?></title>
    <?php endif; ?>

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- will need to get right for desktop version of this site: <meta name="viewport" content="width=device-width, initial-scale=1">-->
    <meta name="robots" content="index, follow" />

    <?php if($page->text()->value !== ''): ?>
    <meta name="description" content="<?php echo html($page->text()) ?>" />
    <?php else: ?>
    <meta name="description" content="<?php echo html($site->description()) ?>" />
    <?php endif ?>

    <?php if($page->tags() !== null): ?>
    <meta name="keywords" content="<?php echo html($page->tags()) ?>" />
    <?php else: ?>
    <meta name="keywords" content="<?php echo html($site->keywords()) ?>" />
    <?php endif ?>

    <!-- Facebook Metatags -->
    <?php snippet('metatags',array('type' => 'facebook')); ?>
    
    <link rel="icon" type="image/png" href="<?php echo url('favicon.ico') ?>">
    <link rel="alternate" type="application/rss+xml" href="http://feeds.feedburner.com/lanningsmith" title="LanningSmith" />
    <?php echo css('assets/styles/styles.css') ?>
    <?php echo css('http://fonts.googleapis.com/css?family=Nunito:300,400') ?>
    <script src="<?php echo $site->url() ?>/assets/js/vendor/modernizr.min.js"></script>
</head>

<body class="<?php echo str_replace('/',' ', $page->uri()) ?>">