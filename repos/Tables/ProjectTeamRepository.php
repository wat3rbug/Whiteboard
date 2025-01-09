<?php
class ProjectTeamRepository {

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

    function doesProjectHaveTeam($project) {
        if (isset($project)) {
            $sql = "SELECT * from team_for_project WHERE project = ?";
            $statement = $this->conn->prepare($sql);
            $statement->bindParam(1, $project);
            $statement->execute();
            $output = array();
            $result = false;
            while ($row = $statement->fetch()) {
                $result = true;
            }
            return $result;
        }
    }

    function addProjectTeam($project, $team) {
        if (isset($project) && isset($team)) {
            $sql = "INSERT INTO team_for_project (team, project) VALUES (?, ?)";
            $statement = $this->conn->prepare($sql);
            $statement->bindParam(1, $team);
            $statement->bindParam(2, $project);
            $statement->execute();
        }
    }

    function updateProjectTeam($project, $team) {
        if (isset($project) && isset($team)) {
            $sql = "UPDATE team_for_project SET team = ? WHERE project = ?";
            $statement = $this->conn->prepare($sql);
            $statement->bindParam(1, $team);
            $statement->bindParam(2, $project);
            $statement->execute();
        }
    }
}