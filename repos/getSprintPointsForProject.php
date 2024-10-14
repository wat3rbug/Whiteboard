<?php
require "Tables/TaskRepository.php";
$project = $_POST['project'];
$sprint = $_POST['sprint'];

if (isset($project) && $project > 0 && isset($sprint) && $sprint > 0) {
	$db = new TaskRepository();
	$data = $db->getSprintPointsForProject($project, $sprint);
	header('Content-type: application/json');
	echo json_encode($data);
}
?>