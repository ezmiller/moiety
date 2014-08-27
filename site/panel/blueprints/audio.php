
# audio blueprint

title: Audio
pages: false
files: false
fields:
  title: 
    label: Audio Title
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
  audio_url:
    label: SoundCloud URL
    type: text
    required: true
    help: The URL of a SoundCloud track (for example, https://soundcloud.com/bookdpodcast/episode-1-of-writers-envy-with)
  audio_embed:
    label: SoundCloud Embed
    type: textarea
    size: medium
    help: The embed code for the track's SoundCloud player. If you do not add this, the system will attempt to automatically generate the embed code.