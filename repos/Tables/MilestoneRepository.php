<?php
class MilestoneRepository {
	
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
	
	function getMilestonesForProject($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * from milestones WHERE project = ? AND deleted = 0";
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
	
	function getMilestoneById($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * FROM milestones WHERE id = ? AND deleted = 0";
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
	
	function addMilestone($project, $task, $name) {
		if (isset($name) && isset($project) && isset($task) && $project > 0 && $task > 0) {
			$sql = "INSERT INTO milestones (name, project, task) VALUES (?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $project);
			$statement->bindParam(3, $task);
			$statement->execute();
		}
	}
	
	function editMilestone($id, $name) {
		if (isset($id) && isset($name) && $id > 0) {
			$sql = "UPDATE milestones SET name = ? WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $name);
			$statement->bindParam(2, $id);
			$statement->execute();
		}
	}
	
	function removeMilestone($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE milestones SET deleted = 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getAllMilestones() {
		$sql = "SELECT * FROM milestones WHERE deleted = 0";
		$statement = $this->conn->query($sql);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
}
?>

		