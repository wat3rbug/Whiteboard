<?php
class SpecialtiesRepository {

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
	function addSkillForUser($lang, $user) {
		if (isset($lang) && isset($user) && $user > 0 && $lang > 0) {
			$sql = "INSERT INTO user_specialties (user, language) VALUES (? , ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $user);
			$statement->bindParam(2, $lang);
			$statement->execute();
		}
	}
	function getSkillsByUser($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT user_specialties.id, languages.language FROM user_specialties JOIN languages ON user_specialties.language = languages.id WHERE user_specialties.deleted = 0 AND user = ? GROUP BY user_specialties.language";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
		}	
		return $output;
	}
	function getAllSkills() {
		$sql = "SELECT user, languages.language FROM user_specialties LEFT JOIN languages ON user_specialties.language = languages.id WHERE user_specialties.deleted = 0";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	function removeSkillFromUser($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE user_specialties SET deleted = 1 WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}	
	}
}
?>