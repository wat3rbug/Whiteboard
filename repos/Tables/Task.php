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
	function getAllTasks() {
		$sql = "SELECT projects.name, projects.start_date, projects.end_date, projects.description, tasks.subject, tasks.description, tasks.state, tasks.sprint from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.deleted = 0";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		while ($row = $statement->fetch()) {
			$output[] = $row;				
		}
		return $output;
	}
	
	function addTask($project, $user, $subject, $description) {
		if (isset($project) && $project > 0 && isset($user) && $user > 0 && isset($subject)) {
			$sql = "INSERT INTO tasks (project, user, subject, description) VALUES (?, ?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $user);
			$statement->bindParam(3, $subject);
			$statement->bindParam(4, $description);
			$statement->execute();
		}
	}
}
?>