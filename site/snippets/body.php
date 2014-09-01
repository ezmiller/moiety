<?php
// do some prep
$splash_on = strtolower($site->splash_page());
$splash_on = ( $page->isHomePage() && ($splash_on === 'yes' || $splash_on == 'true' || $splash_on === 'on') ) ? true : false;
if ( $splash_on ) $splash = $pages->find('/splash');
$categories_on = strtolower($site->categories_enabled());
$categories_on = ( $categories_on === 'yes' || $categories_on === 'true' || $categories_on === 'on' ) ? true : false;
global $category_name;
if ( $categories_on ) {
	$categories = str::split($site->categories(),',');
	$n = array( 'all' => 'All' );
	$s = array('\'',' ');
	$r = array('-','-');
	foreach ($categories as $c) {
		$n[str_replace($s,$r,trim($c))] = $c;	
	}
	$categories = $n;
}
?>
<div class="container">

	<header>
		<div id="logo"><a href="">LANNINGSMITH</a></div>
	</header>

	<?php  if ( $splash_on == true ) : ?>
	<section class="splash">
		<div class="splash-text">
			<h1 class="header"><?php echo $splash ? $splash->header() : ''; ?></h1>
			<h2 class="subheader"><?php echo $splash ? $splash->subheader() : ''; ?></h2>
		</div>
		<?php if ( $splash->hasImages() ) : ?>
			<img src="<?php echo $splash->hasImages() ? $splash->images()->first()->url() : ''; ?>" alt="splash image"/>
		<?php elseif ( $splash->videos()->count() > 0 ) : ?>
			<video loop autoplay src="<?php echo $splash->videos()->first()->url(); ?>">
			</video>
		<?php endif; ?>
	</section>
	<?php endif; ?>

	<section class="about">
		<h2 class="site-description"><?php echo $site->description() ?></h2>
		<?php echo kirbytext($pages->find('/about-us')->text()) ?>
	</section>

	<section class="main">
		<nav class="main-nav">
			<div class="ctrl shutter" title="Open Thumb Menu"></div>
			<div class="ctrl left" title="Previous Image"><img src="/assets/images/arrow_rightleft.png" alt"left arrow"/></div>
			<div class="ctrl right" title="Next Image"><img src="/assets/images/arrow_rightleft.png" alt"right arrow"/></div>
			<div class="ctrl up" title="Previous Project"><!--<img src="/assets/images/arrow_updown.png" alt"up arrow"/>--></div>
			<div class="ctrl down" title="Next Project"><!--<img src="/assets/images/arrow_updown.png" alt"down arrow"/>--></div>
		</nav>
		<div class="main-frame">
		</div>
	</section>

	<section class="gridnav" >
		<nav class="thumbmenu-nav">
			<div class="ctrl shutter" title="Close Thumb Menu"></div>
		</nav>
		<div class="gridframe">
			<div class='jcarousel thumbs'>
				<ul></ul>
			</div>
		</div>
		<div class="categories">
			<?php 
				if ( $categories_on ) {
					foreach ($categories as $i=>$c) {
						$active = ($i === strtolower($category_name)) ? 'active' : '';
						echo '<a class="category-filter '.$active.'" href="'.$site->url.'/category/'.$i.'" data-category="'.$i.'">'.strtoupper($c).'</a>';
						end($categories);
						if ( $i !== key($categories) ) {
							echo '<span> // </span>';
						} 
					}
				}
				?>
		</div>
		<div class="jcarousel-pagination"></div>
	</section>

	<footer></footer>

</div><!-- .container -->