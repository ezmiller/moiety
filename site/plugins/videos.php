<?php 

class videos {

	static function data($url, $source="vimeo") {

		$id = self::parse_vimeo($url);

		$cached_data = self::get_cached($id);

		if ( $cached_data !== false ) {
			return (array)$cached_data;
		}

		$url = '';
		$vimeoBase = 'http://vimeo.com/api/v2/video/';
		$url = $vimeoBase . $id . '.json';

		$ch = curl_init($url);
		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		  curl_setopt($ch, CURLOPT_TIMEOUT, 2);
		$result = json_decode(curl_exec($ch));
		curl_close($ch);

		$result = self::create_video_data($result[0], $source);

		$success = self::set_cache($id, $result);

		if ( ! $success ) 
			error_log('videos.php::data: failed to set cache');

		return $result;
	}

	static function id($url, $source="vimeo") {

		switch ($source) {
			case 'vimeo':
				return self::parse_vimeo($url);
				break;
		}

	}

	static function embed($url, $source="vimeo") {

		$video_data = self::data($url, $source);

		$embed = '<iframe src="http://player.vimeo.com/video/'.$video_data['id'].'" width="'.$video_data['width'].'" height="'.$video_data['height'].'" frameborder="0" badge="0" title="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" ></iframe>';

		return $embed;	

	}

	static function thumb($url, $source="vimeo") {

		$video_data = self::data($url, $source);

		return $video_data['thumbnail'];

	}

	private static function get_cached($video_id) {

		$video_data = db::select('video_cache', 'video_data', array('id'=>$video_id));

		if ( ! empty($video_data) ) {
			return json_decode($video_data[0]['video_data']);
		} else {
			return false;
		}

	}

	private static function set_cache($id, $video_data) {

		$success = db::insert('video_cache', array( 
			'id' => $id, 
			'video_data' => json_encode($video_data)
		));

		if ( $success['status'] === 'error' ) 
			return false;

		return true;

	}

	private static function create_video_data($raw, $source="vimeo") {

		$video_data = array(); dump($raw);

		switch ($source) {
			case 'vimeo':
				$video_data['id'] = $raw->id;
				$video_data['title'] = $raw->title;
				$video_data['thumbnail'] = $raw->thumbnail_large;
				$video_data['width'] = $raw->width;
				$video_data['height'] = $raw->height;
				break;
		}

		return $video_data;

	}

	static function parse_youtube($link){
 
        $regexstr = '~
            # Match Youtube link and embed code
            (?:                             # Group to match embed codes
                (?:<iframe [^>]*src=")?       # If iframe match up to first quote of src
                |(?:                        # Group to match if older embed
                    (?:<object .*>)?      # Match opening Object tag
                    (?:<param .*</param>)*  # Match all param tags
                    (?:<embed [^>]*src=")?  # Match embed tag to the first quote of src
                )?                          # End older embed code group
            )?                              # End embed code groups
            (?:                             # Group youtube url
                https?:\/\/                 # Either http or https
                (?:[\w]+\.)*                # Optional subdomains
                (?:                         # Group host alternatives.
                youtu\.be/                  # Either youtu.be,
                | youtube\.com              # or youtube.com
                | youtube-nocookie\.com     # or youtube-nocookie.com
                )                           # End Host Group
                (?:\S*[^\w\-\s])?           # Extra stuff up to VIDEO_ID
                ([\w\-]{11})                # $1: VIDEO_ID is numeric
                [^\s]*                      # Not a space
            )                               # End group
            "?                              # Match end quote if part of src
            (?:[^>]*>)?                       # Match any extra stuff up to close brace
            (?:                             # Group to match last embed code
                </iframe>                 # Match the end of the iframe
                |</embed></object>          # or Match the end of the older embed
            )?                              # End Group of last bit of embed code
            ~ix';
 
        preg_match($regexstr, $link, $matches);
 
        return $matches[1];
 
    }

 	static function parse_vimeo($link){
 
        $regexstr = '~
            # Match Vimeo link and embed code
            (?:<iframe [^>]*src=")?       # If iframe match up to first quote of src
            (?:                         # Group vimeo url
                https?:\/\/             # Either http or https
                (?:[\w]+\.)*            # Optional subdomains
                vimeo\.com              # Match vimeo.com
                (?:[\/\w]*\/videos?)?   # Optional video sub directory this handles groups links also
                \/                      # Slash before Id
                ([0-9]+)                # $1: VIDEO_ID is numeric
                [^\s]*                  # Not a space
            )                           # End group
            "?                          # Match end quote if part of src
            (?:[^>]*></iframe>)?        # Match the end of the iframe
            (?:<p>.*</p>)?              # Match any title information stuff
            ~ix';
 
        preg_match($regexstr, $link, $matches);
 
        return $matches[1];
    }

}

?>