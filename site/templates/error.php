<?php snippet('header') ?>

<div class="container">

	<div class="error-message">
		<span class="message-header"><?php echo kirbytext($page->title()) ?></span>
		<span class="message-text"><?php echo kirbytext($page->text()) ?></span>
	</div>

</div>

<?php snippet('footer'); ?>

