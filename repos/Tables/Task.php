<?php
class Task {
	
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
	
	function updateTask($id, $subject, $description, $diff, $project) {
		if (isset($id) && isset($subject) && isset($diff) && isset($project) && $id > 0  && $project > 0) {
			$sql = "UPDATE tasks SET subject = ?, difficulty = ?, project = ?, description = ? WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $subject);
			$statement->bindParam(2, $diff);
			$statement->bindParam(3, $project);
			$statement->bindParam(4, $description);
			$statement->bindParam(5, $id);
			$statement->execute();
		}
	}
	
	function getTaskById($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * from tasks WHERE id = ? AND deleted = 0 LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function removeTask($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE tasks SET deleted = 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getAllTasks() {
		$sql = "SELECT tasks.difficulty, tasks.id, projects.name, projects.start_date, projects.end_date, projects.description, tasks.subject, tasks.description, tasks.state, tasks.sprint from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.deleted = 0 ORDER BY tasks.id DESC";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	
	function addTask($project, $user, $subject, $description, $diff) {
		if (isset($project) && $project > 0 && isset($user) && $user > 0 && isset($subject)) {
			$sql = "INSERT INTO tasks (project, user, subject, description, difficulty) VALUES (?, ?, ?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $user);
			$statement->bindParam(3, $subject);
			$statement->bindParam(4, $description);
			$statement->bindParam(5, $diff);
			$statement->execute();
		}
	}
}
?>