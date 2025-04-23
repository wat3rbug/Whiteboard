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
	
	function getSprintPointsForProject($project, $sprint) {
		if (isset($project) && $project > 0 && isset($sprint) && $sprint > 0) {
			$sql = "SELECT * FROM tasks WHERE project = ? AND sprint = ? AND deleted = 0 ORDER BY difficulty DESC";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $project);
			$statement->bindParam(2, $sprint);
			$statement->execute();
			$output = array();
			while($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getAllMilestonesForSprints() {
		$sql = "SELECT milestones.name, tasks.sprint, projects.name AS project FROM milestones JOIN projects ON milestones.project = projects.id JOIN tasks ON milestones.task = tasks.id";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function getAllSprintProjectSummary() {
		
		$sql = "SELECT sprint, sum(difficulty) as sumdiff, projects.name as project, teams.name as team,projects.id as project_id, teams.id as team_id FROM tasks JOIN projects ON projects.id = tasks.project LEFT JOIN teams ON projects.id = teams.project WHERE sprint IS NOT NULL GROUP BY sprint, tasks.project ORDER BY sprint DESC";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
		while($row = $statement->fetch()) {
			$output[] = $row;
		}
		return $output;
	}
	
	function getCompletedTaskTimesForUser($user) {
		if (isset($user) && $user > 0) {
			$lastmonth = date('Y-m-d', strtotime('-30 days'));			
			$sql = "SELECT hours, difficulty FROM tasks WHERE user = ? AND completed IS NOT NULL AND endtime >= ? ORDER BY difficulty ASC, hours DESC";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $user);
			$statement->bindParam(2, $lastmonth);
			$statement->execute();
			$output = array();
			while($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getTasksForProject($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT * FROM tasks WHERE project = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getProjectByTask($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT projects.* FROM tasks JOIN projects ON tasks.project = projects.id WHERE tasks.id = ? AND tasks.deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function incompleteTask($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE tasks SET completed = null WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	function completeTask($id) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE tasks SET state = 4, completed = 1 WHERE id= ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
		}
	}
	function changeState($id, $state) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE tasks SET state = ? WHERE id = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(2, $id);
			$statement->bindParam(1, $state);
			$statement->execute();
		}
	}
	
	function updateEndAndCalcTime($id, $state) {
		if (isset($id) && $id > 0) {
			$sql = "UPDATE tasks SET endtime = NOW() WHERE id = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$sql = "UPDATE tasks SET hours = timediff(endtime, starttime) WHERE id =? AND endtime IS NOT NULL AND starttime IS NOT NULL AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			if ($state == 4) {
				$sql = "UPDATE tasks SET completed = 1 WHERE id = ? AND deleted = 0";
				$statement = $this->conn->prepare($sql);
				$statement->bindParam(1, $id);
				$statement->execute();
			}
		}
	}
	
	function getStateForTask($id) {
		if (isset($id) && $id > 0) {
			$sql = "SELECT state FROM tasks WHERE id = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	function updateEnd($id, $state) {
		if (isset($id) && isset($state) && $id > 0) {
			$sql = "UPDATE tasks SET endtime = NOW(), state = ? WHERE id= ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $state);
			$statement->bindParam(2, $id);
			$statement->execute();
			if ($state == 4) {
				$sql = "UPDATE tasks SET completed = 1 WHERE id = ? AND deleted = 0";
				$statement = $this->conn->prepare($sql);
				$statement->bindParam(1, $id);
				$statement->execute();
			}
		}
	}
	
	function updateStart($id, $state) {
		if (isset($id) && isset($state) && $id > 0) {
			$sql = "UPDATE tasks SET starttime = NOW(), state = ? WHERE id = ? AND deleted = 0";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $state);
			$statement->bindParam(2, $id);
			$statement->execute();
		}	
	}
	
	function changeStateForTask($id, $state) {
		if (isset($id) && isset($state) && $id > 0) {
			$sql = "UPDATE tasks SET state = ? WHERE id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $state);
			$statement->bindParam(2, $id);
			$statement->execute();
		}	
	}
	
	function getTaskDetailsById($id) {
		if (isset($id) && $id > 0){
			$sql = "SELECT projects.name, subject, tasks.description, difficulty, state FROM tasks JOIN projects ON tasks.project = projects.id WHERE tasks.id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}			
	}
	
	function getFilteredOrderedTasksForUser($id, $sprint, $filter) {
		if (isset($id) && isset($sprint) && isset($filter) && $id > 0 && $sprint > 0 && $filter > 0) {
			$sql = "SELECT * FROM v_filtered_tasks_for_sprint WHERE sprint =? AND user = ? AND project_id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->bindParam(2, $id);
			$statement->bindParam(3, $filter);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getOrderedTasksForUser($id, $sprint) {
		if (isset($id) && isset($sprint) && $id > 0 && $sprint > 0) {
			$sql = "SELECT * FROM v_tasks_for_sprint WHERE sprint = ? AND user = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->bindParam(2, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getDiffCountForSprintForUser($id, $sprint) {
		if (isset($sprint) && isset($id) && $id > 0 && $sprint > 0) {
			$sql = "SELECT SUM(difficulty) as count FROM tasks WHERE sprint = ? AND user = ?";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->bindParam(2, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getCompletedDiffForSprintForUser($id, $sprint) {
		if (isset($sprint) && isset($id) && $id > 0 && $sprint > 0) {
			$sql = "SELECT SUM(difficulty) AS count FROM tasks where sprint = ? AND completed IS NOT NULL AND user = ?";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->bindParam(2, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getTaskForSprintByUserId($id, $sprint) {
		if (isset($id) && isset($sprint) && $id > 0 && $sprint > 0) {
			$sql = "SELECT * FROM tasks JOIN projects ON tasks.project = project.id WHERE user = ? AND sprint = ?";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->bindParam(2, $sprint);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getCompletedDiffForSprint($sprint) {
		if (isset($sprint) && $sprint > 0) {
			$sql = "SELECT SUM(difficulty) AS count FROM tasks where sprint = ? AND completed IS NOT NULL";
			$statement =$this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
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
			$output = array();
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
	
	function getFilteredSprintTasks($sprint, $filter) {
		if (isset($sprint) && $sprint > 0) {
			if (isset($filter) && $filter > 0) {
				$sql = "SELECT tasks.id, tasks.difficulty, tasks.subject, projects.name from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.sprint = ? AND tasks.completed IS NULL AND projects.id = ? AND projects.deleted = 0 ORDER BY tasks.id DESC";
				$statement = $this->conn->prepare($sql);
				$statement->bindParam(1, $sprint);
				$statement->bindParam(2, $filter);
				$statement->execute();
				$output = array();
				while ($row = $statement->fetch()) {
					$output[] = $row;
				}
				return $output;
			} else {
				return $this->getSprintTasks($sprint);
			}
		}
	}
	
	function getSprintTasks($sprint) {
		if (isset($sprint) && $sprint > 0) {
			$sql = "SELECT tasks.id, tasks.difficulty, tasks.subject, projects.name, tasks.type from tasks JOIN projects ON tasks.project = projects.id WHERE tasks.sprint = ? AND tasks.completed IS NULL AND projects.deleted = 0 ORDER BY tasks.id DESC";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $sprint);
			$statement->execute();
			$output = array();
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
	
	function getFilteredIncompleteTasks($id) {
		if (isset($id)) {
			$sql = "SELECT * FROM v_incomplete_tasks WHERE project_id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $id);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;
			}
			return $output;
		}
	}
	
	function getAllIncompleteTasks() {
		$sql = "SELECT * FROM v_incomplete_tasks";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
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
			$output = array();
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
	
	function getFilteredTasks($filter) {
		if (isset($filter) && $filter > 0) {
			$sql = "SELECT * FROM v_tasks WHERE project_id = ?";
			$statement = $this->conn->prepare($sql);
			$statement->bindParam(1, $filter);
			$statement->execute();
			$output = array();
			while ($row = $statement->fetch()) {
				$output[] = $row;				
			}
			return $output;
		}
	}
	
	function getAllTasks() {
		$sql = "SELECT * FROM v_tasks";
		$statement = $this->conn->prepare($sql);
		$statement->execute();
		$output = array();
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