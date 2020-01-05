<?php
require "Tables/MilestoneRepository.php";
$project = $_POST['project'];
$task = $_POST['task'];
$name = $_POST['name'];

if (isset($project) && isset($task) && isset($name) && $project > 0 && $task > 0) {
	$db = new MilestoneRepository();
	$db->addMilestone($project, $task, $name);
}
?>