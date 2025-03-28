<?php
class TeamRepository {
	
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
	function updateTeam($id, $name, $project) {
		if (isset($id) && $id > 0 && isset($project) && $project > 0 && isset($name)) {
			$sql = "UPDATE teams SET name = ?, project = ? WHERE id= ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $project);
			$statement->bindParam(3, $id);
			$statement->execute();
		}
	}
	
	function getTeamById($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * from teams WHERE id = ? LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
	
	function removeTeam($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE teams SET deleted = 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getAllTeams() {
		$sql = "SELECT * FROM teams WHERE deleted = 0";
		$statement = $this->conn->query($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	function addTeam($name, $project) {
		if (isset($name) && isset($project) && $project > 0) {
			$sql = "INSERT INTO teams (name, project) VALUES (?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $project);
			$statement->execute();
		}
	}

	function doesProjectHaveTeam($team, $project) {
		if (isset($team) && isset($project)) {
			$sql = "SELECT * FROM teams WHERE project = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->execute();
			$result = false;
			$output = array();
            $result = false;
            while ($row = $statement->fetch()) {
                $result = true;
            }
            return $result;
		}
	}
}
?>