<?php if(!defined('KIRBY')) exit ?>

# default blueprint

title: Project
pages: true
  template: 
    - image
    - video
    - audio
files: false
fields:
  title: 
    label: Project Title
    type:  text
    help: The Name of the Project (REQUIRED)
  text: 
    label: Project Description
    type:  textarea
    size:  medium
    help: Full description of the Project
  categories: 
    label: Categories
    type: categories
    help: "Choose the categories to which this project belongs. This choice determines in which category filters this project will be included."
  tags:
   	label: Project Tags
   	type: tags
    help: "Choose tags for the project here. This is important for SEO. Important: Only choose tags that accurately describe the project."
 