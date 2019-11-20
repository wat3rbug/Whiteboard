<?php
class TeamName {
	
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
	
	function getAllTeamNames() {
		$sql = "SELECT teams.id, project,user,name FROM teams JOIN team_names ON teams.team_name = team_names.id WHERE teams.deleted = 0 GROUP BY team_names.name";
		$statement = $this->conn->query($sql);
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
}
?>