<?php if ($context == 'mainframe') : ?>
	<div class="jcarousel projects">
		<ul>
			<?php foreach ($found->visible() as $item) : ?>
				<li>
					<?php snippet('carousel', array('project'=>$item, 'context'=>'project')) ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
<?php elseif ($context == 'project') : ?>
	<div class="jcarousel project">
		<ul>
			<?php foreach ($project->children() as $media) : ?>
				<?php foreach ($media->images() as $image) : ?>
					<li><img src="<?php echo $image->url() ?>" alt="<?php echo $image->name() ?>" /></li>
				<?php endforeach; ?>
			<?php endforeach; ?>
		</ul>
	</div>
<?php endif; ?>