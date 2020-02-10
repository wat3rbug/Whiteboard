<?php
class CommentRepository {

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
	
	function viewPriorComments($task) {
		if (isset($task) && $task > 0) {
			$sql = "SELECT comments.id, comment, comment_date, first_name, last_name, email FROM comments JOIN users ON comments.user = users.id WHERE comments.task_id = ? AND comments.deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $task);
			$statement->execute();
			$output = array();
			while($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function addComment($task, $user, $comment) {
		if (isset($task) && isset($user) && isset($comment) && $task > 0 && $user > 0) {
			$sql = "INSERT INTO comments (task_id, user, comment, comment_date) VALUES (?, ?, ?, current_date())";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $task);
			$statement->bindParam(2, $user);
			$statement->bindParam(3, $comment);
			$statement->execute();
		}
	}
}
?>