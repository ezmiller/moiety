<?php if(!defined('KIRBY')) die('Direct access is not allowed') ?>
<?php if($settings->pages): ?>
<?php 

$children = ($panel->isHome) ? $pages : $page->children();
$action   = action::sortPages($settings->flip);

?>
<div class="subpages<?php echo ($panel->action == 'edit-pages') ? ' sortable' : '' ?>">

  <form method="post">

  <div class="bar">

    <?php if(!$panel->isHome): ?>
    <a class="button back" href="<?php echo ($page->parent()) ? $page->parent()->url() : url() ?>"><span><?php echo ($page->parent()) ? html($page->parent()->title()) : l::get('pages.home') ?></span></a>
    <?php endif ?>

    <?php if($panel->action == 'edit-pages'): ?>
    <span class="buttons">
      <button class="button" name="sort-action" value="ok"><?php echo l::get('ok') ?></button>
      <button class="button" name="sort-action" value="cancel"><?php echo l::get('cancel') ?></button>
    </span>
    <?php else: ?>
    <span class="buttons">
      <?php if($children->count() && $settings->sortable): ?>
      <a class="button sort" href="<?php echo dourl('content', 'edit-pages') ?>"><?php echo l::get('pages.sort') ?></a>
      <?php endif ?>


      <!-- MAX START -->


      <?php if($panel->isHome):?>
      <a class="button" title="Add Page" href="<?php echo dourl('content', 'add-page') ?>">Add Page</a>
      <?php endif ?>
      
    <?php if($page->template() == get('template', 'default') && !($panel->isHome)): ?>
      <a class="button" title="Add Project" href="<?php echo dourl('content', 'add-page') ?>">Add Project</a>
      <?php endif ?>

      <?php if($page->template() == get('template', 'project')): ?>
      <a class="button" title="Add Media" href="<?php echo dourl('content', 'add-page') ?>">Add Media</a>
      <?php endif ?>

    </span>
    <?php endif ?>

  </div>

  <?php 
  if($page->template() == get('template', 'project')){

    snippet('pages.list', array(
      'type'     => 'visible', 
      'headline' => l::get('media.visible'),//($panel->isHome) ? l::get('pages.title.home') : l::get('pages.title'),
      'children' => $children
    )); 
    
    snippet('pages.list', array(
      'type'     => 'invisible', 
      'headline' => l::get('media.invisible'),//($panel->isHome) ? l::get('pages.invisible.home') : l::get('pages.invisible'),
      'children' => $children
    )); 
  }
  else if($page->template() == get('template', 'default') && !($panel->isHome)){
    snippet('pages.list', array(
      'type'     => 'visible', 
      'headline' => l::get('projects.visible'),//($panel->isHome) ? l::get('pages.title.home') : l::get('pages.title'),
      'children' => $children
    )); 
    
    snippet('pages.list', array(
      'type'     => 'invisible', 
      'headline' => l::get('projects.invisible'),//($panel->isHome) ? l::get('pages.invisible.home') : l::get('pages.invisible'),
      'children' => $children
    )); 

  }
  else{
    snippet('pages.list', array(
      'type'     => 'visible', 
      'headline' => ($panel->isHome) ? l::get('pages.title.home') : l::get('pages.title'),
      'children' => $children
    )); 
    
    snippet('pages.list', array(
      'type'     => 'invisible', 
      'headline' => ($panel->isHome) ? l::get('pages.invisible.home') : l::get('pages.invisible'),
      'children' => $children
    ));
  }
  ?>

  </form>
  
</div>

<?php snippet('pages.add') ?>
<?php snippet('pages.delete') ?>

<?php else: ?>
<div class="subpages">

  <div class="bar">
    <?php if(!$panel->isHome): ?>
    <a class="button back" href="<?php echo ($page->parent()) ? $page->parent()->url() : url() ?>"><span><?php echo ($page->parent()) ? html($page->parent()->title()) : l::get('pages.home') ?></span></a>
    <?php endif ?>
  </div>
<?php /*
  <h3><?php echo l::get('nopages.title') ?></h3>
  <ul>
    <li class="empty"><em><?php echo l::get('nopages.text') ?></em></li>
  </ul>
  */?>

 <!-- MAX END -->


</div>
<?php endif ?>