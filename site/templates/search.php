<?php snippet('header') ?>
<?php snippet('menu') ?>

<?php

$search = new search(array(
  'searchfield' => 'q'
));

$results = $search->results();

?>
<form action="<?php echo thisURL() ?>">
  <input type="text" placeholder="Search…" name="q" />
  <input type="submit" value="Search" />
</form>

<?php if($results): ?>
<ul>
  <?php foreach($results as $result): ?>
  <li><a href="<?php echo $result->url() ?>"><?php echo $result->title() ?></a></li>
  <?php endforeach ?>
</ul>
<?php endif ?>


<?php snippet('footer') ?>