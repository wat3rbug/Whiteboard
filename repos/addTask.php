<?php
require "Tables/Task.php";
$project = $_POST['project'];
$user = $_POST['user'];
$subject = $_POST['subject'];
$description = $_POST['description'];
$diff = $_POST['diff'];

if (isset($project) && $project > 0 && isset($user) && $user > 0 && isset($diff) && $diff > 0 && $diff < 22 && isset($subject)) {
	$db = new Task();
	$db->addTask($project, $user, $subject, $description, $diff);
}
?>