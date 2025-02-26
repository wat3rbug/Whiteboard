<?php
class LanguageRepository {

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
	
	function removeLangFromProject($project, $lang) {
		if (isset($project) && isset($lang) && $project > 0 && $lang > 0) {
			$sql = "UPDATE project_languages SET deleted = 1 where project = ? and language = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $lang);
			$statement->execute();
		}
	}
	
	function getSpecialtyForUsers() {
		$sql = "SELECT languages.language, user_specialties.user FROM user_specialties JOIN languages ON languages.id = user_specialties.language WHERE deleted = 0";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function getAllLanguagesForProjects() {
		$sql = "SELECT project, languages.id, languages.language FROM project_languages JOIN languages ON project_languages.language = languages.id WHERE deleted = 0";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function getLanguagesForProject($project) {
		if (isset($project) && $project > 0) {
			$sql = "SELECT languages.id, languages.language from project_languages JOIN languages ON project_languages.language = languages.id WHERE project_languages.project = ? and project_languages.deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}	
	}
	
	function undeleteLanguageForProject($project, $language) {
		if (isset($project) && isset($language) && $project > 0 && $language > 0) {
			$sql = "UPDATE project_languages SET deleted = 0 WHERE project = ? AND language = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $language);
			$statement->execute();
		}
	}
	
	function addLanguageToProject($project, $language) {
		if (isset($project) && isset($language) && $project > 0 && $language > 0) {
			$sql = "INSERT INTO project_languages (project, language) VALUES (?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $language);
			$statement->execute();
		}
	}
	
	function getLanguageForProject($project, $language) {
		if (isset($project) && isset($language) && $project > 0 && $language > 0) {
			$sql = "SELECT * FROM project_languages WHERE project = ? AND language = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $language);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function addLanguage($language) {
		if (isset($language)) {
			$sql = "INSERT INTO languages (language) VALUES (?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $language);
			$statement->execute();
		}
	}
	
	function getAllLanguages() {
		$sql = "SELECT * FROM languages";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while ($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
}
?>