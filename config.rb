# Require any additional compass plugins here.
require 'compass_twitter_bootstrap'

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "assets/styles"
fonts_dir = "assets/fonts"
sass_dir = "assets/styles/sass"
images_dir = "assets/images"
javascripts_dir = "assets/js"

# select either :production or :development
environment = :development
output_style = (environment == :production) ? :compressed : :expanded

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
