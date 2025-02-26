<?php
require "Tables/TaskRepository.php";
$project = $_POST['project'];
$user = $_POST['user'];
$subject = $_POST['subject'];
$description = $_POST['description'];
$diff = $_POST['diff'];
$type = $_POST['type'];

if (isset($project) && $project > 0 && isset($user) && $user > 0 && isset($diff) && $diff > 0 && $diff < 22 && isset($subject)) {
	$db = new TaskRepository();
	$db->addTask($project, $user, $subject, $description, $diff, $type);
}
?>