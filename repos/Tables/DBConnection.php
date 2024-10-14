<?php

class DBConnection {
	
	public $database;
	public $username;
	public $hostname;
	public $password;
	
	function __construct() {
		$this->password = "1990E30BMW325i";
		$this->database = "whiteboard";
		$this->hostname = "phobos";
		$this->username = "whiteboarduser";
	}
}
?>