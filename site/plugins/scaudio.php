<?php

class scaudio {
	
	public static $client_id = 'bfd6327013f64f8b633d70e366d50ce4';
	public static $client_secret = '85ce90b08b32181e3cee12a05c16b07d';
	public static $baseURL = 'https://api.soundcloud.com';
	public static $embedURL = 'http://soundcloud.com/oembed?format=json&url=';

	public static function thumb($url) {

		$track_data = self::data($url);

		if ( !$track_data ) {
			error_log('scaudio::thumb()  failed to fetch track data');
			return false;
		}

		return $track_data['thumbnail'];
	}

	public static function embed($url) {

		$track_data = self::data($url);

		if ( !$track_data ) {
			error_log('scaudio::embed()  failed to fetch track data');
			return false;
		}

		return $track_data['embed'];
	}


	public static function data($url) {

		$cached_data = self::get_cached($url);

		if ( $cached_data )
			return $cached_data;

		$location = self::resolve($url);

		if ( !$location ) {
			error_log('scaudio::data() failed to resolve url: '.$url);
			return false;
		}
		
		$result = self::request($location);
		$result = array_merge($result, self::request(self::$embedURL.$url));
		$result = self::create_track_data( $result );

		$success = self::set_cache($url, $result);

		if ( !$success ) 
			error_log('scaudio::data()  failed to set cache');

		return $result;

	}

	private static function get_cached($id) {

		$track_data = db::select('audio_cache', 'track_data', array('id'=>$id));

		if ( empty($track_data) ) 
			return false;

		return (array)json_decode($track_data[0]['track_data']);
		
	}

	private static function set_cache($id, $track_data) {

		$success = db::insert('audio_cache', array( 
			'id' => $id, 
			'track_data' => json_encode($track_data)
		));

		if ( $success['status'] === 'error' ) 
			return false;

		return true;

	}

	public static function resolve($url) {

		$url = self::$baseURL.'/resolve.json?url='.$url.'&client_id='.self::$client_id;

		$result = self::request($url);

		if ( isset($result['errors']) ) 
			return false;

		return $result['location'];

	}

	private static function request($url) {

		$ch = curl_init($url);
  		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		  curl_setopt($ch, CURLOPT_TIMEOUT, 2);
		$result = (array)json_decode(curl_exec($ch));
		$httpcode = curl_getinfo($ch,CURLINFO_HTTP_CODE);
		curl_close($ch);

		if ( $httpcode !== 200 && $httpcode !== 302 ) {
			switch ($httpcode) {
				case 404:
					error_log('scaudio::request() request failed with error 404 Not Found');
					break;
				case 401:
					error_log('scaudio::request() request failed with error 401 Not Authorized');
					break;
			}
			return false;
		}

		return $result;

	}

	private static function create_track_data($raw) {

		$track_data = array();

		if ( empty($raw) ) {
			error_log('scaudio::create_track_data() $raw variable that should contain track data was empty.');
			return false;
		}

		$track_data['id'] = $raw['id'];
		$track_data['title'] = $raw['title'];
		$track_data['description'] = $raw['description'];
		$track_data['url'] = $raw['permalink_url'];
		$track_data['thumbnail'] = $raw['thumbnail_url'];
		$track_data['embed'] = str_replace(array('width="100%"','height="400"'), array('width="85%"', 'height="100%"'), $raw['html']);

		return $track_data;

	}



}

?>