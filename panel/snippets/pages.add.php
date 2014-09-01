<?php

if(!defined('KIRBY')) die('Direct access is not allowed');

if($panel->action != 'add-page') return;

$action    = action::addContent();
$templates = data::findTemplates();

?>
<div class="overlay add-page">

  <form method="post">

    <?php growl($action) ?>


    
    <fieldset>
      <?php /*if($panel->isHome):?>
        <h3>New Category</h3>
      <?php endif */?>
      <?php if($page->template() == get('template', 'default') && !($panel->isHome)):?>
        <h3>New Project</h3>
      <?php endif ?>
      <?php if($page->template() == get('template', 'project')):?>
        <h3>New Media</h3>
      <?php endif ?>
      
      
      <div class="field">
        <label><?php echo l::get('pages.add.label.title') ?></label>
        <input type="text" name="title" value="<?php echo html(get('title')) ?>" />
      </div>
      
      <div class="field hide">
        <label><?php echo l::get('pages.add.label.url') ?></label>
        <input type="text" name="uid" value="<?php echo html(get('uid')) ?>" />
      </div>

                         <!-- manually prevented the popup from being shown when the page is of type 'project'.
                        the population of the menu is then limited to "media type" - templates
                        in the end i made sure that the default-template is chosen if the panel is "home"
                        so that we can add categories which are then NOT of type 'project' but use the
                        default template -->


      <div class="field">
        <?php if(count($templates) == 1): ?>
          <?php $template = a::first($templates) ?>
          <label><?php echo l::get('pages.add.label.template') ?>: <em><?php echo html(data::templateName($template)) ?> (<?php echo html($template) ?>)</em></label>
          <input type="hidden" name="template" value="<?php echo html($template) ?>" />

        <?php else: ?>

          <?php if($page->template() == get('template', 'project')):?>
            <label>Type<?php /*echo l::get('pages.add.label.template') */?></label>
            <select name="template">
              <?php foreach($templates as $value): ?>

                <?php if(get('template', 'default') != $value && $value != 'search' && $value != 'project'):?>
                  <option value="<?php echo html($value) ?>"<?php if(get('template', 'image') == $value) echo ' selected="selected"' ?>><?php echo html(data::templateName($value)) ?> (<?php echo html($value) ?>)</option>
                <?php endif ?>

              <?php endforeach ?>

            </select>
          
          <?php else:
              if($panel->isHome)
                $template = get('template', 'default');
              else
                $template = get('template', 'project');
          ?>
          
          <input type="hidden" name="template" value="<?php echo html($template) ?>" />
          
          <?php endif ?>

        <?php endif ?>
          
      </div>


      <div class="buttons">
        <input type="submit" name="add-page" value="<?php echo l::get('pages.add.button') ?>" />
        <input class="cancel" type="submit" name="cancel-add-page" value="<?php echo l::get('cancel') ?>" />
      </div>
                  
    </fieldset>  

  </form>
</div>

