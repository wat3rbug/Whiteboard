<?php

class DBConnection {
	
	public $database;
	public $username;
	public $hostname;
	public $password;
	
	function __construct() {
		$this->password = "1990BMW325!";
		$this->database = "whiteboard";
		// $this->hostname = "db-server1";
		$this->hostname = "localhost";
		$this->username = "whiteboarduser";
	}
}
?>