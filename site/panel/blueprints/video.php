
# video blueprint

title: Video
pages: false
files: false
fields:
  title: 
    label: Video Title
    type:  text
  captiontitle:
    label: Caption Title
    type: text
    help: The caption header 
  text: 
    label: Caption Text
    type:  textarea
    size:  small
    help: Longer text for caption displayed just below caption title
  video_url:
   	label: Video Url
   	type: text
    required: true
    help: The URL of a Vimeo video (for example, http://vimeo.com/87733158)
  video_embed:
    label: Video Embed
    type: textarea
    size: medium
    help: The embed code for the video. If you do not add this, the system will attempt to automatically generate the embed code.