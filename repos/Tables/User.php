<?php
class User {
	
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
	function getUserFromLoginCreds($email, $password) {
		if (isset($email) && isset($password)) {
			$sql = "SELECT * FROM users where email = ? AND password = ? LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $email);
			$statement->bindParam(2, $password);
			$statement->execute();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
	
	function getUserIdFromLogin($email, $password) {
		if (isset($email) && isset($password)) {
			$sql = "SELECT id FROM users where email = ? AND password = ? LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $email);
			$statement->bindParam(2, $password);
			$statement->execute();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
	
	function addNewUser($firstName, $lastName, $email, $password) {
		if (isset($firstName) && isset($lastName) && isset($email) && isset($password)) {
			$sql = "INSERT into users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $firstName);
			$statement->bindParam(2, $lastName);
			$statement->bindParam(3, $email);
			$statement->bindParam(4, $password);
			$statement->execute();
		}
	}
	
	function verifyUser($email, $password) {
		if (isset($email) && isset($password)) {
			$sql = "SELECT id from users WHERE (email = ? AND password = ?) LIMIT 1";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $email);
			$statement->bindParam(2, $password);
			$statement->execute();
			$count = 0;
			while ($row = $statement->fetch()) {
				$count++;
			}
			return $count;
		}
	}
	
	function getNameAndEmailCount($firstName, $lastName, $email) {
		if (isset($firstName) && isset($lastName) && isset($email)) {
			$sql = "SELECT id from users WHERE (first_name = ? AND last_name = ?) OR email = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $firstName);
			$statement->bindParam(2, $lasstName);
			$statement->bindParam(3, $email);
			$statement->execute();
			$count = 0;
			while ($row = $statement->fetch()) {
				$count++;				
			}
			return $count;
		}
	}
	
	function getAllUsers() {
		$sql = "SELECT * from users WHERE deleted = 0";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
}
?>