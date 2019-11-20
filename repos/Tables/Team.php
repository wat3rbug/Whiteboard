<?php
class Team {
	
	private $conn;
	
	function __construct() {
		include_once("DBConnection.php");
		$db = new DBCOnnection();
		$servername = $db->hostname;
		$username = $db->username;
		$password = $db->password;
		$charset = "utf8mb4";
		$database = $db->database;
		$dsn = "mysql:host=$servername;dbname=$database;charset=$charset";
		$options = [
			PDO::ATTR_ERRMODE				=> PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES		=> true,
		];
		try {
			$this->conn = new PDO($dsn, $username, $password);
		} catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
	}
	
	function getAllTeams() {
		$sql = "SELECT teams.id, projects.name, user, team_names.name FROM teams JOIN team_names on teams.team_name = teams_names.id JOIN projects on teams.project = projects.id WHERE team_names.deleted = 0 AND teams.deleted = 0 AND projects.deleted = 0";
		$statement = $this->conn->query($sql);
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
}
?>