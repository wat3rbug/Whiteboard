<?php
class TeamMemberRepository {
	
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
	
	function getTeamMembers($team) {
		if (isset($team)) {
			$sql = "SELECT users.id, first_name, last_name, email, teams.name FROM users JOIN team_members ON users.id = team_members.team_mate JOIN teams ON teams.id = team_members.team WHERE teams.name = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $team);
			$statement->execute();
			$output = array();
			while($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function addUserToTeam($user, $team) {
		if (isset($user) && isset($team) && $user > 0 && $team > 0) {
			$sql = "INSERT INTO team_members (team_mate, team) VALUES (?, ?)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $user);
			$statement->bindParam(2, $team);
			$statement->execute();
		}
	}
	
	function removeUserFromTeam($user, $team) {
		if (isset($user) && isset($team) && $user > 0 && $team > 0) {
			$sql = "UPDATE team_members SET deleted = 1 WHERE team_mate = ? AND team = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $user);
			$statement->bindParam(2, $team);
			$statement->execute();
		}
	}
	
	function getAllUnassignedUsers($team) {
		if (isset($team) && $team > 0) {
			$sql = "SELECT * FROM users WHERE id NOT IN (SELECT team_mate FROM team_members WHERE team = ? AND deleted = 0)";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $team);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
	
	function removeTeamMembersByTeam($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE team_members SET deleted = 1 WHERE team = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	
	function getMembersForTeam($team) {
		if (isset($team) && $team > 0) {
			$sql = "SELECT team_members.id, team_members.team, users.first_name, users.last_name, users.id as userid from team_members LEFT JOIN users ON team_members.team_mate = users.id WHERE team = ? AND team_members.deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $team);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
}
?>