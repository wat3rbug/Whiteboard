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
	
	function getCommentSummaryCount($date) {
		$sql = "SELECT COUNT(*) AS count FROM v_comment_home_page WHERE comment_date >= ?";
		$statement = $this->conn->prepare($sql);
		$statement->bindParam(1, $date);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function getCommentSummaryByPage($date, $page, $count) {
		$offset = $count * $page;
		// this is horrible hackery because I need to keep the variables isolated but limit and offset wont allow it.
		$sql = "SELECT * FROM v_comment_home_page WHERE comment_date >= ? GROUP BY subject ORDER BY comment_date DESC LIMIT " . $count . " OFFSET " . $offset;
		
		$statement = $this->conn->prepare($sql);
		$statement->bindParam(1, $date);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function hasReadComment($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE viewed_comments SET unread = !unread where id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getCommentSummary($date) {
		// need a date check here
		$sql = "SELECT * FROM v_comment_home_page WHERE comment_date >= ? GROUP BY subject ORDER BY comment_date DESC";
		$statement = $this->conn->prepare($sql);
		$statement->bindParam(1, $date);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
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