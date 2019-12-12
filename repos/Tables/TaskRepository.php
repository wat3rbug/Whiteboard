<?php
class TaskRepository {
	
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
	
	function updateUnfinishedTasksToNewSprint($oldid, $newid) {
		if (isset($newid) && isset($oldid) && $newid > 0 && $oldid > 0) {
			$sql = "UPDATE tasks SET sprint = ? WHERE sprint = ? AND completed IS NULL";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $newid);
			$statement->bindParam(2, $oldid);
			$statement->execute();
		}
	}
	
	function getDiffCountForSprint($sprint) {
		if (isset($sprint) && $sprint > 0) {
			$sql = "SELECT SUM(difficulty) as count FROM tasks WHERE sprint = ?";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->execute();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	function removeTaskFromSprint($id) {
		if (isset($id) && $id > 0 )	{
			$sql = "UPDATE tasks set sprint= NULL where id = ?";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getSprintTasks($sprint) {
		if (isset($sprint) && $sprint > 0) {
			$sql = "SELECT tasks.id, tasks.difficulty, tasks.subject, projects.name from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.sprint = ? AND tasks.completed IS NULL ORDER BY tasks.id DESC";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->execute();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
		}	
		return $output;
	}
	
	function addTaskToSprint($id, $sprint) {
		if (isset($id) && isset($sprint) && $id > 0 && $sprint > 0) {
			$sql = "UPDATE tasks SET sprint = ? WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->bindParam(2, $id);
			$statement->execute();
		}
	}
	
	function getAllIncompleteTasks() {
		$sql = "SELECT tasks.id, tasks.difficulty, tasks.subject, projects.name FROM tasks JOIN projects ON tasks.project = projects.id WHERE tasks.sprint IS NULL ORDER BY tasks.id DESC";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function updateTask($id, $subject, $description, $diff, $project,  $type) {
		if (isset($id) && isset($subject) && isset($diff) && isset($project) && $id > 0  && $project > 0) {
			$sql = "UPDATE tasks SET subject = ?, difficulty = ?, project = ?, description = ?, type = ? WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $subject);
			$statement->bindParam(2, $diff);
			$statement->bindParam(3, $project);
			$statement->bindParam(4, $description);
			$statement->bindParam(5, $type);
			$statement->bindParam(6, $id);
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
		$sql = "SELECT tasks.difficulty, tasks.id, projects.name, projects.start_date, projects.end_date, tasks.difficulty, tasks.type, projects.description, tasks.subject, tasks.description, tasks.state, tasks.sprint from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.deleted = 0 ORDER BY tasks.id DESC";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	
	function addTask($project, $user, $subject, $description, $diff, $type) {
		if (isset($project) && $project > 0 && isset($user) && $user > 0 && isset($subject)) {
			$sql = "INSERT INTO tasks (project, user, subject, description, difficulty, type) VALUES (?, ?, ?, ?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $user);
			$statement->bindParam(3, $subject);
			$statement->bindParam(4, $description);
			$statement->bindParam(5, $diff);
			$statement->bindParam(6, $type);
			$statement->execute();
		}
	}
}
?>