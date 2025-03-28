<?php
class ProjectRepository {
	
	private $conn;
	
	function __construct() {
		include_once("DBConnection.php");
		$db = new DBConnection();
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
	function getProjectsByFilter($active) {
		if (isset($active) && ($active =="0" || $active == "1")) {
			if ($active == "0") {
				$sql = "SELECT * FROM projects WHERE deleted = 0 ORDER BY id DESC";
			} else {
				$sql = "SELECT * FROM projects WHERE deleted = 0 AND inactive = 0 ORDER BY id DESC";
			}		
			$statement = $this->conn->prepare($sql);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}	
	}
	
	function toggleProjectActive($project) {
		if (isset($project) && $project > 0) {
			$sql = "UPDATE projects SET inactive = inactive XOR 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->execute();
		}
	}
	
	function getProjectByDetails($name, $desc, $start, $end) {
		if (isset($name) && isset($start) && isset($end)) {
			if (isset($desc)) {
				$sql = "SELECT * FROM projects WHERE name = ? AND description = ? AND start_date = ? AND end_date = ? AND deleted = 0 ORDER BY id DESC LIMIT 1";
				$statement = $this->conn->prepare($sql);
				$statement->bindParam(1, $name);
				$statement->bindParam(2, $desc);
				$statement->bindParam(3, $start);
				$statement->bindParam(4, $end);
				$statement->execute();
				$output = array();
				while ($row = $statement->fetch()) {
					$output[] = $row;
				}
			} else {
				$sql = "SELECT * FROM projects WHERE name = ? AND start_date = ? AND end_date = ? AND deleted = 0 ORDER BY id DESC LIMIT 1";
				$statement = $this->conn->prepare($sql);
				$statement->bindParam(1, $name);
				$statement->bindParam(2, $start);
				$statement->bindParam(3, $end);
				$statement->execute();
				$output = array();
				while ($row = $statement->fetch()) {
					$output[] = $row;
				}
			}
			return $output;
		}
	}
	
	function updateProject($id, $name, $desc, $start, $end) {
		if (isset($id) && $id > 0 && isset($name) && isset($start) && isset($end)) {
			$sql = "UPDATE projects SET name = ?, description = ?, start_date =?, end_date = ? WHERE id = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $desc);
			$statement->bindParam(3, $start);
			$statement->bindParam(4, $end);
			$statement->bindParam(5, $id);
			$statement->execute();
		}
	}
	function addProject($name, $desc, $start, $end) {
		if (isset($name) && isset($start) && isset($end)) {
			$sql = "INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $desc);
			$statement->bindParam(3, $start);
			$statement->bindParam(4, $end);
			$statement->execute();
		}
	}
	
	function getProjectById($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * FROM projects WHERE id = ? LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function removeProject($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE projects SET deleted = 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getAllProjects() {
		$sql = "SELECT projects.*, teams.name AS team, teams.id AS teamid FROM projects JOIN teams ON projects.id = teams.project WHERE projects.deleted = 0 ORDER BY id DESC";
		$statement = $this->conn->query($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	function getProjectNameAndIds() {
		$sql = "SELECT id, name FROM projects WHERE deleted = 0";
		$statement = $this->conn->query($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}

	function getActiveProjectNameAndIds() {
		$sql = "SELECT id, name FROM projects WHERE deleted = 0 AND inactive = 0";
		$statement = $this->conn->query($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	
	function getAllProjectsAndTeams() {
		$sql = "SELECT * FROM projects LEFT JOIN teams on teams.project = projects.id WHERE projects.deleted = 0";
		$statement = $this->conn->prepare($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	
	function getAllProjectsWithTeam() {
		$sql = "SELECT projects.name, start_date, end_date, team_names.name AS team FROM projects LEFT JOIN teams ON teams.project = projects.id LEFT JOIN team_names ON teams.team_name = team_names.id WHERE projects.deleted = 0";
		$statement = $this->conn->query($sql);
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
}
?>