	<?php
		// dump all projets into array to be transferred to javascript via json
		$allprojects = $pages->find('projects')->children()->visible();
		$transfer = array();
		$i=0;
		foreach ($allprojects as $p) {
			$media = array();
			$thumb = null;
			if ( $p->countChildren() > 0 ) {

				if ($p->children->first()->template() === 'image' ) {
					$thumb = thumb($p->children()->first()->images()->first(), array('width'=>210));
				}
				else if ( $p->children()->first()->template() === 'video' ) {
					$thumb = '<img src="'.videos::thumb($p->children()->first()->video_url()->value).'" alt="video thumbnail"/>';
				}
				else if ( $p->children()->first()->template() === 'audio' ) {
					$thumb = '<img src="'.scaudio::thumb($p->children()->first()->audio_url()->value).'" alt="audio thumbnail"/>';
				}

				$count = 0;
				foreach ( $p->children()->visible() as $c ) {

					$mtype = $c->template();

					$title = ($c->title() !== null) ? $c->title()->value : '';
					$caption_title = ($c->captiontitle() !== null) ? $c->captiontitle()->value : '';
					$description = ($c->text() !== null) ? $c->text()->value : '';

					$count++;

					switch ($mtype) {
						case 'image':
							if($c->images()->first()){
								$media[] = array(
									'type' => $mtype,
									'url' => $c->images()->first()->url(),
									'width' => $c->images()->first()->width(),
									'height' => $c->images()->first()->height(),
									'title' => $title,
									'caption_title' => $caption_title,
									'description' => $description
								);
							}
							break;
						case 'video':
							$embed = '';
							$url = $c->video_url()->value;
							if ( !isset($c->video_embed()->value) || $c->video_embed()->value == '' ) {
								$embed = videos::embed($url);
							} else {
								$embed = $c->video_embed()->value;
							}
							$media[] = array(
								'type' => $mtype,
								'id' => videos::id($url),
								'url' => $c->video_url()->value,
								'title' => $title,
								'caption_title' => $caption_title,
								'description' => $description,
								'embed' => $embed,
								'thumb' => videos::thumb($url)
							);
							break;
						case 'audio':
							$embed = '';
							$url = $c->audio_url()->value;
							if ( !isset($c->audio_embed()->value) || $c->audio_embed()->value == '' ) {
								$embed = scaudio::embed($url);
							} else {
								$embed = $c->audio_embed()->value;
							}
							$media[] = array(
								'type' => $mtype,
								'id' => $url,
								'url' => $url,
								'title' => $title,
								'caption_title' => $caption_title,
								'description' => $description,
								'embed' => $embed,
								'thumb' => scaudio::thumb($url)
							);
							break;
					}
				}
				$media['length'] = $count;

				if ( ! empty($media) ) {
					$transfer[] = array(
						'i' => $i,
						'title' => $p->title()->value,
						'url' => str_replace('/projects','',$p->url()),
						'thumb' => $thumb,
						'media' => $media,
						'description' => $p->text()->value,
						'categories' => $p->categories()->value
					);
					$i++;
				}
			}
		}
	?>
	<script>
	var siteURL = <?php echo "'".$site->url()."';" ?>
	var siteTitle = <?php echo "'".$site->title()."';" ?>
	var projects = <?php print json_encode($transfer).';'; ?>
	var iil = <?php echo "'".$site->images_in_loop()."';" ?>
	var gV = <?php echo "'".$site->grid_visible()."';" ?>
	var imagesInLoop = iil == "TRUE" || iil == "True"|| iil == "true"|| iil == "YES" || iil == "Yes" || iil == "yes" ? 1 : 0;
	var gridVisible = gV == "TRUE" || gV == "True"|| gV == "true"|| gV == "YES" || gV == "Yes" || gV == "yes" ? 1 : 0;
	</script>

	<!-- RequireJS: Loads jQuery and Other Modules -->
	<script data-main="/assets/js/app" src="/assets/js/vendor/require.js"></script>

	<!-- Google Analytics -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-48791613-1', 'lanningsmith.com');
		ga('send', 'pageview');
	</script>

</body>

</html>